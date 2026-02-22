import { NextRequest, NextResponse } from 'next/server'
import { DonationSchema } from '@/lib/validator'
import { connectionToDatabase } from '@/lib/db/index'
import Donation from '@/lib/db/models/donation.model'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = DonationSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      )
    }

    await connectionToDatabase()

    const donation = await Donation.create(result.data)

    return NextResponse.json({
      success: true,
      donationId: donation._id,
    })
  } catch (error) {
    console.error('Donation error:', error)
    return NextResponse.json(
      { error: 'Failed to submit donation' },
      { status: 500 }
    )
  }
}
