import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest()
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 })
    }

    const data = await request.json()
    const { title, titleEn, logo, cover, genres, year, description, isOngoing, videoUrl, scheduledAt } = data

    if (!title || !logo || !genres || !year || !description || !scheduledAt) {
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
        status: 'scheduled',
        scheduledAt: new Date(scheduledAt),
      },
    })

    return NextResponse.json({ anime }, { status: 201 })
  } catch (error) {
    console.error('Schedule anime error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
