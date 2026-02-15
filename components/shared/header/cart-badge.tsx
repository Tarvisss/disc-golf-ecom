'use client'

import { ShoppingCartIcon } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/cart-store'

export function CartBadge() {
  const { items } = useCartStore()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Link href="/cart" className="header-button">
      <div className="relative flex items-end">
        <ShoppingCartIcon className="h-6 w-6" />
        Cart
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-3 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </div>
    </Link>
  )
}
