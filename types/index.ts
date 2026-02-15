import { CartSchema, OrderItemSchema, ProductInputSchema } from "@/lib/validator";
import { z } from 'zod'

export type IProductInput = z.infer<typeof ProductInputSchema>
export type CartItem = z.infer<typeof OrderItemSchema>
export type Cart = z.infer<typeof CartSchema>

export type Data = {
    products: IProductInput[]
    headerMenus: {
        name: string
        href: string
    }[]
    carousels: {
        image: string
        url: string
        title: string
        buttonCaption: string
        isPublished: boolean
    }[]
}
