import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest()
    if (!user) {
      return NextResponse.json({ error: 'Avtorizatsiya talab etiladi' }, { status: 401 })
    }

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
    })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
