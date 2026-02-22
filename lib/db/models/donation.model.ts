import { Document, Model, model, models, Schema } from 'mongoose'

export interface IDonation extends Document {
  donorName: string
  email: string
  phone: string
  discBrand: string
  discModel: string
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor'
  description?: string
  status: 'pending' | 'received' | 'processed'
  createdAt: Date
  updatedAt: Date
}

const donationSchema = new Schema<IDonation>(
  {
    donorName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    discBrand: { type: String, required: true },
    discModel: { type: String, required: true },
    condition: {
      type: String,
      enum: ['new', 'like-new', 'good', 'fair', 'poor'],
      required: true,
    },
    description: { type: String },
    status: {
      type: String,
      enum: ['pending', 'received', 'processed'],
      default: 'pending',
    },
  },
  { timestamps: true }
)

const Donation =
  (models.Donation as Model<IDonation>) ||
  model<IDonation>('Donation', donationSchema)

export default Donation
