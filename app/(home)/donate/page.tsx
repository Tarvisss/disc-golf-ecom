'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DonationForm } from '@/components/shared/donate/donation-form'
import { z } from 'zod'
import { DonationSchema } from '@/lib/validator'

type DonationData = z.infer<typeof DonationSchema>

export default function DonatePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDonation(data: DonationData) {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        setError(result.error || 'Something went wrong')
        setLoading(false)
        return
      }

      router.push('/donate/success')
    } catch {
      setError('Failed to submit donation. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-input mb-6">Donate a Disc</h1>

      {/* Info Section */}
      <div className="bg-background/80 backdrop-blur-sm p-8 rounded-lg border mb-8 space-y-4">
        <h2 className="text-xl font-bold text-input">How It Works</h2>
        <p className="text-muted-foreground">
          Have discs collecting dust? Give them a second life! We accept gently used
          and new disc golf discs. Donated discs help grow the sport and keep
          affordable options available for players of all levels.
        </p>

        <div className="space-y-2">
          <h3 className="font-semibold text-input">What we accept:</h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>Any brand of disc golf disc</li>
            <li>New, like-new, or gently used condition</li>
            <li>Putters, midranges, fairway drivers, and distance drivers</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-input">Ship your discs to:</h3>
          <address className="text-muted-foreground not-italic">
            Disc-Go-Round<br />
            123 Fairway Drive<br />
            Toronto, ON M5V 1A1<br />
            Canada
          </address>
        </div>
      </div>

      {/* Form Section */}
      {error && (
        <div className="mb-4 rounded-md bg-destructive/10 border border-destructive p-3 text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="max-w-2xl">
        <div className="bg-background/80 backdrop-blur-sm p-8 rounded-lg border">
          <DonationForm onSubmit={handleDonation} loading={loading} />
        </div>
      </div>
    </div>
  )
}
