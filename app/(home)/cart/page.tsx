'use client'

import Link from 'next/link'
import { Vortex } from '@/components/ui/vortex'
import { CartItemRow } from '@/components/shared/cart/cart-item-row'
import { CartSummary } from '@/components/shared/cart/cart-summary'
import { ConfirmDialog } from '@/components/shared/cart/confirm-dialog'
import { useCartStore } from '@/lib/store/cart-store'
import { Button } from '@/components/ui/button'

export default function CartPage() {
  const { items, clearCart } = useCartStore()

  return (
    <Vortex className="relative min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-input">Shopping Cart</h1>
          {items.length > 0 && (
            <ConfirmDialog
              title="Clear cart"
              description="Are you sure you want to remove all items from your cart?"
              onConfirm={clearCart}
            >
              <Button variant="outline">Clear Cart</Button>
            </ConfirmDialog>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <p className="text-input text-lg">Your cart is empty.</p>
            <Button asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {items.map((item) => (
                <CartItemRow key={item.clientId} item={item} />
              ))}
            </div>
            <div>
              <CartSummary />
            </div>
          </div>
        )}
      </div>
    </Vortex>
  )
}
