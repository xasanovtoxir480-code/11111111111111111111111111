import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ error: 'Email va kod kiritilishi shart' }, { status: 400 })
    }

    // Find valid OTP
    const otpRecord = await db.otpCode.findFirst({
      where: {
        email,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!otpRecord) {
      return NextResponse.json({ error: 'Kod noto\'g\'ri yoki muddati o\'tgan' }, { status: 400 })
    }

    // Mark OTP as used
    await db.otpCode.update({
      where: { id: otpRecord.id },
      data: { used: true },
    })

    // Get user
    const user = await db.user.findUnique({ where: { id: otpRecord.userId! } })
    if (!user) {
      return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 400 })
    }

    // Generate session token
    const token = generateToken()
    await db.user.update({
      where: { id: user.id },
      data: { sessionToken: token },
    })

    return NextResponse.json({
      user: {
        id: user.id,
        userId: user.userId,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        balance: user.balance,
        isPremium: user.isPremium,
        premiumExpiry: user.premiumExpiry,
        isAdmin: user.isAdmin,
      },
      token,
    })
  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
