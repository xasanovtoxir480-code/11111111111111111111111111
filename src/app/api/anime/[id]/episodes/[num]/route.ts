import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; num: string }> }
) {
  try {
    const user = await getUserFromRequest()
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 })
    }

    const { id, num } = await params
    await db.episode.deleteMany({
      where: { animeId: id, number: parseInt(num) },
    })

    return NextResponse.json({ message: 'Epizod o\'chirildi' })
  } catch (error) {
    console.error('Delete episode error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
