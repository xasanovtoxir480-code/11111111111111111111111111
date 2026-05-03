import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const episodes = await db.episode.findMany({
      where: { animeId: id },
      orderBy: { number: 'asc' },
    })

    return NextResponse.json({ episodes })
  } catch (error) {
    console.error('Get episodes error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

export async function POST(
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
    const { number, title, videoUrl, duration } = data

    if (!number || !videoUrl) {
      return NextResponse.json({ error: 'Majburiy maydonlar to\'ldirilmagan' }, { status: 400 })
    }

    const episode = await db.episode.create({
      data: {
        animeId: id,
        number: parseInt(number),
        title,
        videoUrl,
        duration: duration ? parseInt(duration) : null,
      },
    })

    return NextResponse.json({ episode }, { status: 201 })
  } catch (error) {
    console.error('Add episode error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
