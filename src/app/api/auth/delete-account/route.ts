import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest()
    if (!user) {
      return NextResponse.json({ error: 'Avtorizatsiya talab etiladi' }, { status: 401 })
    }

    // Delete all related data
    await db.transaction.deleteMany({ where: { userId: user.id } })
    await db.favorite.deleteMany({ where: { userId: user.id } })
    await db.download.deleteMany({ where: { userId: user.id } })
    await db.otpCode.deleteMany({ where: { userId: user.id } })
    await db.user.delete({ where: { id: user.id } })

    return NextResponse.json({ message: 'Hisob o\'chirildi' })
  } catch (error) {
    console.error('Delete account error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
