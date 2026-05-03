import { NextRequest, NextResponse } from 'next/server'

// Request dan asosiy URL ni olish (Caddy/Nginx reverse proxy orqali ishlaydi)
function getBaseUrl(request: NextRequest): string {
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'http'
  const host = request.headers.get('host') || 'localhost:3000'
  return `${forwardedProto}://${host}`
}

// GET - Google OAuth authorize (yo'naltirish)
export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const redirectUri = process.env.GOOGLE_REDIRECT_URI
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || getBaseUrl(request)

  if (!clientId || clientId === 'your-google-client-id.apps.googleusercontent.com') {
    // Google OAuth sozlanmagan - setup guide sahifasiga yo'naltirish
    return NextResponse.redirect(`${baseUrl}?auth=error&message=not_configured`)
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri || '',
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
    hl: 'uz',
  })

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`

  return NextResponse.redirect(googleAuthUrl)
}
