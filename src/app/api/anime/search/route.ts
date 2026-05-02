import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''

    if (!q || q.length < 2) {
      return NextResponse.json({ anime: [] })
    }

    const anime = await db.anime.findMany({
      where: {
        status: 'published',
        OR: [
          { title: { contains: q } },
          { titleEn: { contains: q } },
          { description: { contains: q } },
          { genres: { contains: q } },
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
