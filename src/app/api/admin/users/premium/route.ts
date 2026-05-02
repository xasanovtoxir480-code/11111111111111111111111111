import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const admin = await getUserFromRequest()
    if (!admin || !admin.isAdmin) {
      return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 })
    }

    const { userId, months } = await request.json()
    if (!userId || !months || ![1, 3, 6, 12].includes(months)) {
      return NextResponse.json({ error: 'Noto\'g\'ri ma\'lumot' }, { status: 400 })
    }

    const user = await db.user.findUnique({ where: { userId } })
    if (!user) {
      return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 })
    }

    const expiryDate = user.isPremium && user.premiumExpiry && new Date(user.premiumExpiry) > new Date()
      ? new Date(new Date(user.premiumExpiry).getTime() + months * 30 * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000)

    await db.user.update({
      where: { userId },
      data: {
        isPremium: true,
        premiumExpiry: expiryDate,
      },
    })

    return NextResponse.json({ message: `Premium ${months} oy berildi`, expiryDate })
  } catch (error) {
    console.error('Give premium error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
