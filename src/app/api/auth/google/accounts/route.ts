import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Google hisoblar ro'yxati (demo: barcha userlarni qaytaradi)
export async function GET() {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    // Google Account Chooser formatida qaytarish
    const accounts = users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name || user.email.split('@')[0],
      avatar: user.avatar,
    }))

    return NextResponse.json({ accounts })
  } catch (error) {
    console.error('Get google accounts error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
