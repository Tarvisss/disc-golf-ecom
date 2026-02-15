import { Document, Model, model, models, Schema } from 'mongoose'

export interface IOrder extends Document {
  user:
    | string
    | {
        name: string
        email: string
      }
  items: {
    clientId: string
    product: string
    name: string
    slug: string
    category: string
    quantity: number
    countInStock: number
    image: string
    price: number
    size?: string
    color?: string
  }[]
  shippingAddress: {
    fullName: string
    street: string
    city: string
    postalCode: string
    province: string
    phone: string
    country: string
  }
  paymentMethod: string
  paymentResult?: {
    id: string
    status: string
    email_address: string
    pricePaid: string
  }
  itemsPrice: number
  shippingPrice: number
  taxPrice: number
  totalPrice: number
  expectedDeliveryDate: Date
  isPaid: boolean
  paidAt?: Date
  isDelivered: boolean
  deliveredAt?: Date
  stripeSessionId?: string
  createdAt: Date
  updatedAt: Date
}

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.Mixed,
      required: true,
    },
    items: [
      {
        clientId: { type: String, required: true },
        product: { type: String, required: true },
        name: { type: String, required: true },
        slug: { type: String, required: true },
        category: { type: String, required: true },
        quantity: { type: Number, required: true },
        countInStock: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        size: { type: String },
        color: { type: String },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      province: { type: String, required: true },
      phone: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true, default: 'Stripe' },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      email_address: { type: String },
      pricePaid: { type: String },
    },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    expectedDeliveryDate: { type: Date, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
    stripeSessionId: { type: String, unique: true, sparse: true },
  },
  {
    timestamps: true,
  }
)

const Order =
  (models.Order as Model<IOrder>) || model<IOrder>('Order', orderSchema)

export default Order
