import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ animeId: string }> }
) {
  try {
    const user = await getUserFromRequest()
    if (!user) {
      return NextResponse.json({ error: 'Avtorizatsiya talab etiladi' }, { status: 401 })
    }

    const { animeId } = await params
    await db.download.deleteMany({
      where: { userId: user.id, animeId },
    })

    return NextResponse.json({ message: 'Yuklanma o\'chirildi' })
  } catch (error) {
    console.error('Remove download error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
