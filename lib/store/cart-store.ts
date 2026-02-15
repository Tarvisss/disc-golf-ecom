'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Cart, CartItem } from '@/types'

const TAX_RATE = 0.08

function calcPrices(items: CartItem[]) {
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

type CartState = Cart & {
  addItem: (item: CartItem) => void
  removeItem: (clientId: string) => void
  updateQuantity: (clientId: string, quantity: number) => void
  clearCart: () => void
}

const initialState: Pick<
  Cart,
  'items' | 'itemsPrice' | 'taxPrice' | 'shippingPrice' | 'totalPrice'
> = {
  items: [],
  itemsPrice: 0,
  taxPrice: 0,
  shippingPrice: 0,
  totalPrice: 0,
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      ...initialState,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.clientId === item.clientId
          )

          let items: CartItem[]
          if (existing) {
            const newQty = Math.min(
              existing.quantity + item.quantity,
              item.countInStock
            )
            items = state.items.map((i) =>
              i.clientId === item.clientId ? { ...i, quantity: newQty } : i
            )
          } else {
            items = [...state.items, item]
          }

          return { items, ...calcPrices(items) }
        }),

      removeItem: (clientId) =>
        set((state) => {
          const items = state.items.filter((i) => i.clientId !== clientId)
          return { items, ...calcPrices(items) }
        }),

      updateQuantity: (clientId, quantity) =>
        set((state) => {
          const items = state.items.map((i) =>
            i.clientId === clientId ? { ...i, quantity } : i
          )
          return { items, ...calcPrices(items) }
        }),

      clearCart: () => set(initialState),
    }),
    { name: 'cart-storage' }
  )
)
