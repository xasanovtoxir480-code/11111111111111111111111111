import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const anime = await db.anime.findUnique({
      where: { id },
      include: {
        episodes: { orderBy: { number: 'asc' } },
        _count: { select: { favorites: true } },
      },
    })

    if (!anime) {
      return NextResponse.json({ error: 'Anime topilmadi' }, { status: 404 })
    }

    let isFavorited = false
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const user = await db.user.findUnique({ where: { sessionToken: token } })
      if (user) {
        const fav = await db.favorite.findUnique({
          where: { userId_animeId: { userId: user.id, animeId: id } },
        })
        isFavorited = !!fav
      }
    }

    return NextResponse.json({
      anime: { ...anime, isFavorited, favoriteCount: anime._count.favorites },
    })
  } catch (error) {
    console.error('Get anime detail error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest()
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 })
    }

    const { id } = await params
    const data = await request.json()

    const anime = await db.anime.update({
      where: { id },
      data,
    })

    return NextResponse.json({ anime })
  } catch (error) {
    console.error('Update anime error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest()
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 })
    }

    const { id } = await params
    await db.anime.delete({ where: { id } })

    return NextResponse.json({ message: 'Anime o\'chirildi' })
  } catch (error) {
    console.error('Delete anime error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
