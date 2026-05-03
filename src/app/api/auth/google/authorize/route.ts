import { NextRequest, NextResponse } from 'next/server'

// GET - Google OAuth authorize (yo'naltirish)
export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const redirectUri = process.env.GOOGLE_REDIRECT_URI

  if (!clientId || clientId === 'your-google-client-id.apps.googleusercontent.com') {
    // Google OAuth sozlanmagan - demo rejimda modal ochish uchun signal
    return NextResponse.json({ 
      error: 'GOOGLE_OAUTH_NOT_CONFIGURED',
      message: 'Google OAuth sozlanmagan. .env faylida GOOGLE_CLIENT_ID ni kiriting.' 
    }, { status: 400 })
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri || '',
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
    hl: 'uz', // O'zbek tilida
  })

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`

  return NextResponse.redirect(googleAuthUrl)
}
