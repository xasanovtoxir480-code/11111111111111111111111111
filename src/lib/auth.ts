import { db } from '@/lib/db'
import { headers } from 'next/headers'

export function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function generateUserId(): string {
  return Math.floor(100000000 + Math.random() * 900000000).toString()
}

export async function getUserFromToken(token: string) {
  if (!token) return null
  const user = await db.user.findFirst({
    where: { sessionToken: token },
  })
  return user
}

export async function getUserFromRequest(): Promise<{ id: string; userId: string; email: string; name: string | null; avatar: string | null; balance: number; isPremium: boolean; premiumExpiry: Date | null; isAdmin: boolean } | null> {
  const headersList = await headers()
  const authHeader = headersList.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  const token = authHeader.substring(7)
  return getUserFromToken(token)
}

export function sanitizeUser(user: any) {
  if (!user) return null
  return {
    id: user.id,
    userId: user.userId,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    balance: user.balance,
    isPremium: user.isPremium,
    premiumExpiry: user.premiumExpiry,
    isAdmin: user.isAdmin,
  }
}
