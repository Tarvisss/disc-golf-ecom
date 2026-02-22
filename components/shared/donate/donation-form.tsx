'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DonationSchema } from '@/lib/validator'
import { z } from 'zod'

type DonationData = z.infer<typeof DonationSchema>
type FieldErrors = Partial<Record<keyof DonationData, string>>

const textFields: { name: keyof DonationData; label: string; placeholder: string; type?: string }[] = [
  { name: 'donorName', label: 'Your Name', placeholder: 'John Doe' },
  { name: 'email', label: 'Email', placeholder: 'john@example.com', type: 'email' },
  { name: 'phone', label: 'Phone', placeholder: '(555) 123-4567' },
  { name: 'discBrand', label: 'Disc Brand', placeholder: 'Innova, Discraft, MVP...' },
  { name: 'discModel', label: 'Disc Model', placeholder: 'Destroyer, Buzzz, Reactor...' },
]

const conditions = [
  { value: 'new', label: 'New' },
  { value: 'like-new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
]

interface DonationFormProps {
  onSubmit: (data: DonationData) => void
  loading?: boolean
}

export function DonationForm({ onSubmit, loading }: DonationFormProps) {
  const [formData, setFormData] = useState<DonationData>({
    donorName: '',
    email: '',
    phone: '',
    discBrand: '',
    discModel: '',
    condition: 'good',
    description: '',
  })
  const [errors, setErrors] = useState<FieldErrors>({})

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const result = DonationSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: FieldErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof DonationData
        if (!fieldErrors[field]) fieldErrors[field] = issue.message
      }
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    onSubmit(result.data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-input">Disc Donation Form</h2>

      {textFields.map((field) => (
        <div key={field.name} className="space-y-1">
          <label htmlFor={field.name} className="text-sm font-medium text-muted-foreground">
            {field.label}
          </label>
          <Input
            id={field.name}
            name={field.name}
            type={field.type || 'text'}
            placeholder={field.placeholder}
            value={formData[field.name] as string}
            onChange={handleChange}
            className={errors[field.name] ? 'border-destructive' : ''}
          />
          {errors[field.name] && (
            <p className="text-xs text-destructive">{errors[field.name]}</p>
          )}
        </div>
      ))}

      <div className="space-y-1">
        <label className="text-sm font-medium text-muted-foreground">Condition</label>
        <Select
          value={formData.condition}
          onValueChange={(value) => {
            setFormData((prev) => ({ ...prev, condition: value as DonationData['condition'] }))
            if (errors.condition) setErrors((prev) => ({ ...prev, condition: undefined }))
          }}
        >
          <SelectTrigger className={errors.condition ? 'border-destructive' : ''}>
            <SelectValue placeholder="Select condition" />
          </SelectTrigger>
          <SelectContent>
            {conditions.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.condition && (
          <p className="text-xs text-destructive">{errors.condition}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="description" className="text-sm font-medium text-muted-foreground">
          Additional Details (optional)
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="Color, weight, any damage, or anything else we should know..."
          value={formData.description || ''}
          onChange={handleChange}
          rows={3}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Donation'}
      </Button>
    </form>
  )
}
