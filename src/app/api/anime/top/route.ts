import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { publishDueScheduledAnime } from '@/lib/scheduler'

export async function GET() {
  try {
    await publishDueScheduledAnime()
    const anime = await db.anime.findMany({
      where: { status: 'published' },
      orderBy: { views: 'desc' },
      take: 6,
    })

    return NextResponse.json({ anime })
  } catch (error) {
    console.error('Get top anime error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
