import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateOTP, generateUserId, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@gmail.com')) {
      return NextResponse.json({ error: 'Faqat Gmail manzili bilan kirish mumkin' }, { status: 400 })
    }

    // Create user if not exists (same as send-otp but Google-branded)
    let user = await db.user.findUnique({ where: { email } })

    if (!user) {
      let userId = generateUserId()
      // Ensure unique userId
      let existing = await db.user.findUnique({ where: { userId } })
      while (existing) {
        userId = generateUserId()
        existing = await db.user.findUnique({ where: { userId } })
      }
      user = await db.user.create({
        data: {
          email,
          userId,
          name: email.split('@')[0],
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=4285F4&color=fff&size=128`,
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
      message: 'Google tasdiqlash kodi yuborildi',
      otp, // Demo only - in production, send via email
    })
  } catch (error) {
    console.error('Google auth error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
