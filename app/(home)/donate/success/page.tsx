import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function DonateSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-5xl">&#10003;</div>
        <h1 className="text-3xl font-bold text-input">Thank You!</h1>
        <p className="text-muted-foreground">
          Your disc donation submission has been received. We&#39;ll be in touch
          via email with shipping confirmation once your disc arrives.
        </p>
        <Button asChild size="lg">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  )
}
