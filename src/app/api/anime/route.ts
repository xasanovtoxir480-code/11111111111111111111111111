import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'
    const genre = searchParams.get('genre')
    const year = searchParams.get('year')
    const sort = searchParams.get('sort') || 'views'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = { status: 'published' }

    if (status === 'ongoing') where.isOngoing = true
    if (status === 'completed') where.isOngoing = false
    if (genre) where.genres = { contains: genre }
    if (year) where.year = parseInt(year)

    const orderBy = sort === 'date' ? { createdAt: 'desc' } : { views: 'desc' }

    const [anime, total] = await Promise.all([
      db.anime.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.anime.count({ where }),
    ])

    return NextResponse.json({
      anime,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Get anime error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest()
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 })
    }

    const data = await request.json()
    const { title, titleEn, logo, cover, genres, year, description, isOngoing, videoUrl } = data

    if (!title || !logo || !genres || !year || !description) {
      return NextResponse.json({ error: 'Majburiy maydonlar to\'ldirilmagan' }, { status: 400 })
    }

    const anime = await db.anime.create({
      data: {
        title,
        titleEn,
        logo,
        cover,
        genres,
        year: parseInt(year),
        description,
        isOngoing: isOngoing || false,
        videoUrl,
        status: 'published',
      },
    })

    // If videoUrl is provided, auto-create the first episode
    if (videoUrl) {
      await db.episode.create({
        data: {
          animeId: anime.id,
          number: 1,
          title: '1-qism',
          videoUrl,
        },
      })
    }

    return NextResponse.json({ anime }, { status: 201 })
  } catch (error) {
    console.error('Create anime error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
