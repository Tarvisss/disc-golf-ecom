'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ShippingAddressSchema } from '@/lib/validator'
import { z } from 'zod'

type ShippingAddress = z.infer<typeof ShippingAddressSchema>

type FieldErrors = Partial<Record<keyof ShippingAddress | 'email', string>>

const fields: { name: keyof ShippingAddress; label: string; placeholder: string }[] = [
  { name: 'fullName', label: 'Full Name', placeholder: 'John Doe' },
  { name: 'street', label: 'Street Address', placeholder: '123 Main St' },
  { name: 'city', label: 'City', placeholder: 'Toronto' },
  { name: 'province', label: 'Province', placeholder: 'Ontario' },
  { name: 'postalCode', label: 'Postal Code', placeholder: 'A1A 1A1' },
  { name: 'country', label: 'Country', placeholder: 'Canada' },
  { name: 'phone', label: 'Phone', placeholder: '(555) 123-4567' },
]

export interface ShippingFormData extends ShippingAddress {
  email: string
}

interface ShippingFormProps {
  onSubmit: (data: ShippingFormData) => void
  loading?: boolean
}

export function ShippingForm({ onSubmit, loading }: ShippingFormProps) {
  const [formData, setFormData] = useState<ShippingFormData>({
    fullName: '',
    street: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'Canada',
    phone: '',
    email: '',
  })
  const [errors, setErrors] = useState<FieldErrors>({})

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { email, ...address } = formData
    const result = ShippingAddressSchema.safeParse(address)
    if (!result.success) {
      const fieldErrors: FieldErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ShippingAddress
        if (!fieldErrors[field]) fieldErrors[field] = issue.message
      }
      setErrors(fieldErrors)
      return
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: 'Valid email is required' })
      return
    }
    setErrors({})
    onSubmit({ ...result.data, email })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">Shipping Address</h2>
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'border-destructive' : ''}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email}</p>
        )}
      </div>
      {fields.map((field) => (
        <div key={field.name} className="space-y-1">
          <label htmlFor={field.name} className="text-sm font-medium text-muted-foreground">
            {field.label}
          </label>
          <Input
            id={field.name}
            name={field.name}
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChange={handleChange}
            className={errors[field.name] ? 'border-destructive' : ''}
          />
          {errors[field.name] && (
            <p className="text-xs text-destructive">{errors[field.name]}</p>
          )}
        </div>
      ))}
      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </Button>
    </form>
  )
}
