import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest()
    if (!user) {
      return NextResponse.json({ error: 'Avtorizatsiya talab etiladi' }, { status: 401 })
    }

    const downloads = await db.download.findMany({
      where: { userId: user.id },
      include: { anime: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ downloads })
  } catch (error) {
    console.error('Get downloads error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
