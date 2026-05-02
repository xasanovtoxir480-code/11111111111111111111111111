import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getUserFromRequest()
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 })
    }

    const anime = await db.anime.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { episodes: true, favorites: true } },
      },
    })

    return NextResponse.json({ anime })
  } catch (error) {
    console.error('Get admin anime error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
