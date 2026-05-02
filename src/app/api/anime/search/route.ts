import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''

    if (!q || q.length < 1) {
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
    })

    return NextResponse.json({ anime })
  } catch (error) {
    console.error('Search anime error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
