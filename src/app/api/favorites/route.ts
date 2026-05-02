import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest()
    if (!user) {
      return NextResponse.json({ error: 'Avtorizatsiya talab etiladi' }, { status: 401 })
    }

    const favorites = await db.favorite.findMany({
      where: { userId: user.id },
      include: { anime: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ favorites })
  } catch (error) {
    console.error('Get favorites error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest()
    if (!user) {
      return NextResponse.json({ error: 'Avtorizatsiya talab etiladi' }, { status: 401 })
    }

    const { animeId } = await request.json()
    if (!animeId) {
      return NextResponse.json({ error: 'Anime ID kerak' }, { status: 400 })
    }

    const favorite = await db.favorite.create({
      data: { userId: user.id, animeId },
    })

    return NextResponse.json({ favorite }, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ message: 'Allaqachon qo\'shilgan' })
    }
    console.error('Add favorite error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
