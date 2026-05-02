import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const admin = await getUserFromRequest()
    if (!admin || !admin.isAdmin) {
      return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 })
    }

    const { userId, amount } = await request.json()
    if (!userId || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Noto\'g\'ri ma\'lumot' }, { status: 400 })
    }

    const user = await db.user.findUnique({ where: { userId } })
    if (!user) {
      return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 })
    }

    await db.user.update({
      where: { userId },
      data: { balance: { increment: amount } },
    })

    await db.transaction.create({
      data: {
        userId: user.id,
        type: 'admin_transfer',
        amount,
        description: `Admin tomonidan o'tkazma (${admin.userId})`,
      },
    })

    return NextResponse.json({ message: `${amount} so'm o'tkazildi` })
  } catch (error) {
    console.error('Transfer balance error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
