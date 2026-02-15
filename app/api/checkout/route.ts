import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { OrderItemSchema, ShippingAddressSchema } from '@/lib/validator'
import { z } from 'zod'

const TAX_RATE = 0.08

const CheckoutRequestSchema = z.object({
  items: z.array(OrderItemSchema).min(1, 'Cart must have at least one item'),
  shippingAddress: ShippingAddressSchema,
  email: z.string().email().optional(),
})

function calcPrices(items: z.infer<typeof OrderItemSchema>[]) {
  const itemsPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )
  const taxPrice = Math.round(itemsPrice * TAX_RATE * 100) / 100
  const shippingPrice = itemsPrice > 100 ? 0 : 10
  const totalPrice =
    Math.round((itemsPrice + taxPrice + shippingPrice) * 100) / 100

  return { itemsPrice, taxPrice, shippingPrice, totalPrice }
}

// Split items JSON across multiple metadata keys (Stripe 500 char limit per value)
function splitItemsMetadata(items: z.infer<typeof OrderItemSchema>[]) {
  const fullJson = JSON.stringify(items)
  const metadata: Record<string, string> = {}
  const chunkSize = 490
  const chunks = Math.ceil(fullJson.length / chunkSize)
  metadata.items_chunks = chunks.toString()
  for (let i = 0; i < chunks; i++) {
    metadata[`items_${i}`] = fullJson.slice(i * chunkSize, (i + 1) * chunkSize)
  }
  return metadata
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = CheckoutRequestSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      )
    }

    const { items, shippingAddress, email } = result.data

    // Calculate prices server-side (never trust client)
    const prices = calcPrices(items)

    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'cad',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Stripe uses cents
      },
      quantity: item.quantity,
    }))

    // Add shipping as a line item if not free
    if (prices.shippingPrice > 0) {
      lineItems.push({
        price_data: {
          currency: 'cad',
          product_data: {
            name: 'Shipping',
            images: [],
          },
          unit_amount: Math.round(prices.shippingPrice * 100),
        },
        quantity: 1,
      })
    }

    // Add tax as a line item
    if (prices.taxPrice > 0) {
      lineItems.push({
        price_data: {
          currency: 'cad',
          product_data: {
            name: 'Tax',
            images: [],
          },
          unit_amount: Math.round(prices.taxPrice * 100),
        },
        quantity: 1,
      })
    }

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: email,
      success_url: `${req.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/checkout`,
      metadata: {
        // Stripe metadata values are limited to 500 chars each
        // Split items across multiple keys if needed
        ...splitItemsMetadata(items),
        shippingAddress: JSON.stringify(shippingAddress),
        itemsPrice: prices.itemsPrice.toString(),
        taxPrice: prices.taxPrice.toString(),
        shippingPrice: prices.shippingPrice.toString(),
        totalPrice: prices.totalPrice.toString(),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
