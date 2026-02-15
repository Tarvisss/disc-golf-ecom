'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Vortex } from '@/components/ui/vortex'
import { ShippingForm, ShippingFormData } from '@/components/shared/checkout/shipping-form'
import { CartSummary } from '@/components/shared/cart/cart-summary'
import { useCartStore } from '@/lib/store/cart-store'
import { Button } from '@/components/ui/button'

export default function CheckoutPage() {
  const { items, itemsPrice, taxPrice, shippingPrice, totalPrice } =
    useCartStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCheckout(data: ShippingFormData) {
    const { email, ...address } = data
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingAddress: address,
          email,
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        setError(result.error || 'Something went wrong')
        setLoading(false)
        return
      }

      // Redirect to Stripe Checkout
      router.push(result.url)
    } catch {
      setError('Failed to create checkout session. Please try again.')
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <Vortex className="relative min-h-screen">
        <div className="container mx-auto px-4 py-8 text-center space-y-4">
          <p className="text-input text-lg">Your cart is empty.</p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </Vortex>
    )
  }

  return (
    <Vortex className="relative min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-input mb-6">Checkout</h1>

        {error && (
          <div className="mb-4 rounded-md bg-destructive/10 border border-destructive p-3 text-destructive text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-card p-6 shadow-sm">
              <ShippingForm onSubmit={handleCheckout} loading={loading} />
            </div>
          </div>
          <div>
            <CartSummary />
          </div>
        </div>
      </div>
    </Vortex>
  )
}
