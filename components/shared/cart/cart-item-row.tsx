'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store/cart-store'
import { ConfirmDialog } from './confirm-dialog'
import { CartItem } from '@/types'
import { Minus, Plus, Trash2 } from 'lucide-react'

type CartItemRowProps = {
  item: CartItem
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { removeItem, updateQuantity } = useCartStore()

  return (
    <div className="flex items-center gap-4 py-4 border-b border-white/20">
      <Link href={`/product/${item.slug}`} className="shrink-0">
        <div className="relative w-20 h-20 overflow-hidden rounded-full">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <Link href={`/product/${item.slug}`}>
          <h3 className="font-semibold text-input truncate hover:underline">
            {item.name}
          </h3>
        </Link>
        <p className="text-sm text-input/70 capitalize">
          {item.category}
        </p>
        <p className="font-bold text-input mt-1">${item.price.toFixed(2)}</p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            if (item.quantity > 1) {
              updateQuantity(item.clientId, item.quantity - 1)
            }
          }}
          disabled={item.quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>

        <span className="w-8 text-center font-medium text-input">
          {item.quantity}
        </span>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            if (item.quantity < item.countInStock) {
              updateQuantity(item.clientId, item.quantity + 1)
            }
          }}
          disabled={item.quantity >= item.countInStock}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ConfirmDialog
        title="Remove item"
        description={`Are you sure you want to remove "${item.name}" from your cart?`}
        onConfirm={() => removeItem(item.clientId)}
      >
        <Button
          variant="ghost"
          size="icon"
          className="text-red-400 hover:text-red-300"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </ConfirmDialog>
    </div>
  )
}
