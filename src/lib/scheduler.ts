import { db } from './db'

/**
 * Rejalashtirilgan anime vaqti kelgan bo'lsa avtomatik 'published' holatga o'tkazadi.
 * Har safar bosh sahifa yoki anime ro'yxati API'si chaqirilganda ishlaydi.
 */
export async function publishDueScheduledAnime(): Promise<number> {
  try {
    const now = new Date()

    const result = await db.anime.updateMany({
      where: {
        status: 'scheduled',
        scheduledAt: {
          lte: now,
        },
      },
      data: {
        status: 'published',
      },
    })

    if (result.count > 0) {
      console.log(`[Scheduler] ${result.count} ta rejalashtirilgan anime 'published' holatga o'tkazildi`)
    }

    return result.count
  } catch (error) {
    console.error('[Scheduler] Avtomatik publishing xatosi:', error)
    return 0
  }
}
