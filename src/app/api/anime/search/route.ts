import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { publishDueScheduledAnime } from '@/lib/scheduler'

export async function GET(request: NextRequest) {
  try {
    await publishDueScheduledAnime()
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''

    if (!q || q.length < 2) {
      return NextResponse.json({ anime: [] })
    }

    const anime = await db.anime.findMany({
      where: {
        status: 'published',
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { titleEn: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { genres: { contains: q, mode: 'insensitive' } },
        ],
      },
      orderBy: { views: 'desc' },
      take: 30,
    })

    return NextResponse.json({ anime })
  } catch (error) {
    console.error('Search anime error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
