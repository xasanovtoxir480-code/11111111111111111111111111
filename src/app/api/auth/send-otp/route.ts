import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateOTP, generateUserId, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email noto\'g\'ri' }, { status: 400 })
    }

    // Create user if not exists
    let user = await db.user.findUnique({ where: { email } })

    if (!user) {
      const userId = generateUserId()
      // Ensure unique userId
      let existing = await db.user.findUnique({ where: { userId } })
      while (existing) {
        userId = generateUserId() as any
        existing = await db.user.findUnique({ where: { userId: userId as string } })
      }
      user = await db.user.create({
        data: {
          email,
          userId: userId as unknown as string,
          name: email.split('@')[0],
        },
      })
    }

    // Generate OTP
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    await db.otpCode.create({
      data: {
        email,
        code: otp,
        expiresAt,
        userId: user.id,
      },
    })

    // Return OTP directly for demo (simulating email)
    return NextResponse.json({
      message: 'OTP yuborildi',
      otp, // Demo only - in production, send via email
    })
  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
