'use client'

import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store/cart-store'
import Link from 'next/link'

export function CartSummary() {
  const { items, itemsPrice, taxPrice, shippingPrice, totalPrice } =
    useCartStore()

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="rounded-lg bg-card p-6 shadow-sm space-y-4">
      <h2 className="text-xl font-bold">Order Summary</h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Items ({itemCount})
          </span>
          <span>${itemsPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>{(shippingPrice ?? 0) === 0 ? 'Free' : `$${shippingPrice!.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax</span>
          <span>${(taxPrice ?? 0).toFixed(2)}</span>
        </div>
      </div>

      <hr />

      <div className="flex justify-between font-bold text-lg">
        <span>Total</span>
        <span>${totalPrice.toFixed(2)}</span>
      </div>

      <Button asChild size="lg" className="w-full">
        <Link href="/checkout">Proceed to Checkout</Link>
      </Button>
    </div>
  )
}
