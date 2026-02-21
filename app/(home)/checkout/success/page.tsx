'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store/cart-store'

interface OrderDetails {
  orderId: string
  totalPrice: number
  itemsCount: number
  shippingAddress: {
    fullName: string
    city: string
    province: string
  }
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-lg text-input">Confirming your order...</div>
        </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const clearCart = useCartStore((s) => s.clearCart)

  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessionId) {
      setError('No session found.')
      setLoading(false)
      return
    }

    async function confirmOrder() {
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        })

        const data = await res.json()

        if (!res.ok) {
          setError(data.error || 'Failed to confirm order')
          setLoading(false)
          return
        }

        setOrder(data)
        clearCart()
      } catch {
        setError('Failed to confirm order. Please contact support.')
      } finally {
        setLoading(false)
      }
    }

    confirmOrder()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  return (
      <div className="container mx-auto px-4 py-16 text-center">
        {loading && (
          <div className="space-y-4">
            <div className="text-lg text-input">Confirming your order...</div>
          </div>
        )}

        {error && (
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-destructive">Oops!</h1>
            <p className="text-input">{error}</p>
            <Button asChild>
              <Link href="/cart">Back to Cart</Link>
            </Button>
          </div>
        )}

        {order && (
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-5xl">✓</div>
            <h1 className="text-3xl font-bold text-input">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you for your order, {order.shippingAddress.fullName}!
            </p>

            <div className="rounded-lg bg-card p-6 shadow-sm text-left space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-mono text-xs">{order.orderId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Items</span>
                <span>{order.itemsCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping to</span>
                <span>
                  {order.shippingAddress.city},{' '}
                  {order.shippingAddress.province}
                </span>
              </div>
              <hr />
              <div className="flex justify-between font-bold">
                <span>Total Paid</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <Button asChild size="lg">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        )}
      </div>
  )
}
