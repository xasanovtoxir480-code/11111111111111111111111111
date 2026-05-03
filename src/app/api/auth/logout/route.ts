import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest()
    if (!user) {
      return NextResponse.json({ error: 'Avtorizatsiya talab etiladi' }, { status: 401 })
    }

    await db.user.update({
      where: { id: user.id },
      data: { sessionToken: null },
    })

    return NextResponse.json({ message: 'Tizimdan chiqdingiz' })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
