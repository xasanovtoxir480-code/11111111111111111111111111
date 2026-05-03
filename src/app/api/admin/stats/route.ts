import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getUserFromRequest()
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 })
    }

    const today = new Date().toISOString().split('T')[0]
    const stats = await db.dailyStats.findUnique({
      where: { date: today },
    })

    const totalUsers = await db.user.count()
    const premiumUsers = await db.user.count({ where: { isPremium: true } })
    const totalAnime = await db.anime.count({ where: { status: 'published' } })

    return NextResponse.json({
      stats: stats || { totalViews: 0, newPremiums: 0, totalRevenue: 0, activeUsers: 0 },
      totalUsers,
      premiumUsers,
      totalAnime,
    })
  } catch (error) {
    console.error('Get admin stats error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
