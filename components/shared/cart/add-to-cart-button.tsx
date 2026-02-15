'use client'

import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store/cart-store'
import { CartItem } from '@/types'
import { useState } from 'react'

type AddToCartButtonProps = {
  item: CartItem
  className?: string
}

export function AddToCartButton({ item, className }: AddToCartButtonProps) {
  const { addItem } = useCartStore()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem(item)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <Button
      size="lg"
      className={className}
      disabled={item.countInStock === 0}
      onClick={handleAdd}
    >
      {item.countInStock === 0
        ? 'Out of Stock'
        : added
          ? 'Added!'
          : 'Add to Cart'}
    </Button>
  )
}
