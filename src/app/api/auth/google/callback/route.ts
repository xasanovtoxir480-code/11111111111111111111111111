import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateToken, generateUserId } from '@/lib/auth'

// Request dan asosiy URL ni olish (Caddy/Nginx reverse proxy orqali ishlaydi)
function getBaseUrl(request: NextRequest): string {
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'http'
  const host = request.headers.get('host') || 'localhost:3000'
  return `${forwardedProto}://${host}`
}

// GET - Google OAuth callback
export async function GET(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || getBaseUrl(request)

    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      console.error('Google OAuth error:', error)
      return NextResponse.redirect(`${baseUrl}?auth=error&message=${encodeURIComponent(error)}`)
    }

    if (!code) {
      return NextResponse.redirect(`${baseUrl}?auth=error&message=no_code`)
    }

    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = process.env.GOOGLE_REDIRECT_URI

    // Access token olish
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId || '',
        client_secret: clientSecret || '',
        redirect_uri: redirectUri || '',
        grant_type: 'authorization_code',
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token) {
      console.error('Google token error:', tokenData)
      return NextResponse.redirect(`${baseUrl}?auth=error&message=token_failed`)
    }

    // User ma'lumotlarini olish
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })

    const googleUser = await userResponse.json()

    if (!googleUser.email) {
      return NextResponse.redirect(`${baseUrl}?auth=error&message=no_email`)
    }

    // User bazada bor yoki yo'qligini tekshirish
    let user = await db.user.findUnique({ where: { email: googleUser.email } })

    if (!user) {
      let userId = generateUserId()
      let existing = await db.user.findUnique({ where: { userId } })
      while (existing) {
        userId = generateUserId()
        existing = await db.user.findUnique({ where: { userId } })
      }

      user = await db.user.create({
        data: {
          email: googleUser.email,
          userId,
          name: googleUser.name || googleUser.email.split('@')[0],
          avatar: googleUser.picture || null,
        },
      })
    } else {
      // Avatar va nomni yangilash
      await db.user.update({
        where: { id: user.id },
        data: {
          name: googleUser.name || user.name,
          avatar: googleUser.picture || user.avatar,
        },
      })
    }

    // Token generatsiya
    const sessionToken = generateToken()
    await db.user.update({
      where: { id: user.id },
      data: { sessionToken },
    })

    // Redirect with token
    return NextResponse.redirect(`${baseUrl}?auth=success&token=${sessionToken}&userId=${user.id}`)

  } catch (err) {
    console.error('Google OAuth callback error:', err)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || getBaseUrl(request)
    return NextResponse.redirect(`${baseUrl}?auth=error&message=server_error`)
  }
}
