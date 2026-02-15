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
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ received: true })
    }

    try {
      await connectionToDatabase()

      // Skip if order already exists
      const existing = await Order.findOne({
        stripeSessionId: session.id,
      })
      if (existing) {
        return NextResponse.json({ received: true })
      }

      const items = getItemsFromMetadata(session.metadata || {})
      const shippingAddress = JSON.parse(
        session.metadata?.shippingAddress || '{}'
      )
      const itemsPrice = parseFloat(session.metadata?.itemsPrice || '0')
      const taxPrice = parseFloat(session.metadata?.taxPrice || '0')
      const shippingPrice = parseFloat(session.metadata?.shippingPrice || '0')
      const totalPrice = parseFloat(session.metadata?.totalPrice || '0')

      const expectedDeliveryDate = new Date()
      expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 7)

      await Order.create({
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
        stripeSessionId: session.id,
      })
    } catch (error) {
      console.error('Webhook order creation error:', error)
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ received: true })
}
