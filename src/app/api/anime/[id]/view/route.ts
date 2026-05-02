import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.anime.update({
      where: { id },
      data: { views: { increment: 1 } },
    })

    return NextResponse.json({ message: 'Ko\'rish soni oshirildi' })
  } catch (error) {
    console.error('Increment view error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
