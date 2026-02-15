import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { connectionToDatabase } from '@/lib/db/index'
import Order from '@/lib/db/models/order.model'
import Stripe from 'stripe'

function getItemsFromMetadata(metadata: Stripe.Metadata) {
  const chunks = parseInt(metadata.items_chunks || '0')
  if (chunks === 0) return JSON.parse(metadata.items || '[]')
  let json = ''
  for (let i = 0; i < chunks; i++) {
    json += metadata[`items_${i}`] || ''
  }
  return JSON.parse(json)
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json()

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Retrieve the Stripe session to verify payment
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      )
    }

    await connectionToDatabase()

    // Check if order already exists for this session
    const existingOrder = await Order.findOne({ stripeSessionId: sessionId })
    if (existingOrder) {
      return NextResponse.json({
        orderId: existingOrder._id,
        totalPrice: existingOrder.totalPrice,
        itemsCount: existingOrder.items.length,
        shippingAddress: existingOrder.shippingAddress,
      })
    }

    // Extract data from session metadata
    const items = getItemsFromMetadata(session.metadata || {})
    const shippingAddress = JSON.parse(
      session.metadata?.shippingAddress || '{}'
    )
    const itemsPrice = parseFloat(session.metadata?.itemsPrice || '0')
    const taxPrice = parseFloat(session.metadata?.taxPrice || '0')
    const shippingPrice = parseFloat(session.metadata?.shippingPrice || '0')
    const totalPrice = parseFloat(session.metadata?.totalPrice || '0')

    // Set expected delivery to 7 days from now
    const expectedDeliveryDate = new Date()
    expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 7)

    const order = await Order.create({
      user: {
        name: shippingAddress.fullName,
        email: session.customer_details?.email || 'guest@checkout.com',
      },
      items,
      shippingAddress,
      paymentMethod: 'Stripe',
      paymentResult: {
        id: session.payment_intent as string,
        status: session.payment_status,
        email_address:
          session.customer_details?.email || 'guest@checkout.com',
        pricePaid: totalPrice.toFixed(2),
      },
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      expectedDeliveryDate,
      isPaid: true,
      paidAt: new Date(),
      stripeSessionId: sessionId,
    })

    return NextResponse.json({
      orderId: order._id,
      totalPrice: order.totalPrice,
      itemsCount: order.items.length,
      shippingAddress: order.shippingAddress,
    })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
