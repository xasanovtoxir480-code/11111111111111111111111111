import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

const PREMIUM_PRICES: Record<number, number> = {
  1: 25000,
  3: 65000,
  6: 120000,
  12: 200000,
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest()
    if (!user) {
      return NextResponse.json({ error: 'Avtorizatsiya talab etiladi' }, { status: 401 })
    }

    const { months } = await request.json()
    if (!months || !PREMIUM_PRICES[months]) {
      return NextResponse.json({ error: 'Noto\'g\'ri muddat' }, { status: 400 })
    }

    const price = PREMIUM_PRICES[months]

    if (user.balance < price) {
      return NextResponse.json({ error: 'Balans yetarli emas' }, { status: 400 })
    }

    const expiryDate = user.isPremium && user.premiumExpiry && new Date(user.premiumExpiry) > new Date()
      ? new Date(new Date(user.premiumExpiry).getTime() + months * 30 * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000)

    await db.user.update({
      where: { id: user.id },
      data: {
        balance: { decrement: price },
        isPremium: true,
        premiumExpiry: expiryDate,
      },
    })

    await db.transaction.create({
      data: {
        userId: user.id,
        type: 'premium_purchase',
        amount: price,
        description: `Premium ${months} oy`,
      },
    })

    // Update daily stats
    const today = new Date().toISOString().split('T')[0]
    await db.dailyStats.upsert({
      where: { date: today },
      update: {
        totalRevenue: { increment: price },
        newPremiums: { increment: 1 },
      },
      create: {
        date: today,
        totalRevenue: price,
        newPremiums: 1,
      },
    })

    return NextResponse.json({
      message: `Premium ${months} oyga faollashtirildi`,
      expiryDate,
    })
  } catch (error) {
    console.error('Purchase premium error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
