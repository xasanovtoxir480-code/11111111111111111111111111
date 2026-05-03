'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { Mail, ArrowRight, Sparkles, X, ArrowLeft, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp'
import { motion, AnimatePresence } from 'framer-motion'

interface GoogleAccount {
  id: string
  email: string
  name: string
  avatar: string | null
}

// Avatar ranglari - email ga qarab
const AVATAR_COLORS = [
  '#4285F4', '#EA4335', '#FBBC05', '#34A853',
  '#8E44AD', '#E67E22', '#1ABC9C', '#E74C3C',
  '#2ECC71', '#9B59B6', '#3498DB', '#F39C12',
]

function getAvatarColor(email: string): string {
  let hash = 0
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export default function AuthPage() {
  const { setUser, setToken, navigate } = useAppStore()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [sentOtp, setSentOtp] = useState('')
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Google modal state
  const [showGoogleModal, setShowGoogleModal] = useState(false)
  const [googleAccounts, setGoogleAccounts] = useState<GoogleAccount[]>([])
  const [googleLoading, setGoogleLoading] = useState(false)
  const [googleSelected, setGoogleSelected] = useState<GoogleAccount | null>(null)
  const [googleStep, setGoogleStep] = useState<'chooser' | 'verify'>('chooser')
  const [googleReady, setGoogleReady] = useState<boolean | null>(null)

  // Google OAuth callback ni ushlash (URL param orqali token keladi)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const authStatus = params.get('auth')
    const authToken = params.get('token')

    if (authStatus === 'success' && authToken) {
      // Google OAuth muvaffaqiyatli - token bilan kirish
      setToken(authToken)
      // URL dan paramlarni tozalash
      window.history.replaceState({}, '', window.location.pathname)
      // User ma'lumotlarini olish
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` },
      })
        .then(r => r.json())
        .then(data => {
          if (data.user) {
            setUser(data.user)
            navigate('home')
          }
        })
        .catch(() => {})
    } else if (authStatus === 'error') {
      setError('Google kirish muvaffaqiyatsiz. Qayta urinib ko\'ring.')
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  // Google OAuth tayyorligini tekshirish
  useEffect(() => {
    fetch('/api/auth/google/authorize')
      .then(r => r.json())
      .then(data => setGoogleReady(data.error !== 'GOOGLE_OAUTH_NOT_CONFIGURED'))
      .catch(() => setGoogleReady(false))
  }, [])

  const handleSendOTP = async (emailAddr: string) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailAddr }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setSentOtp(data.otp)
        setEmail(emailAddr)
        setStep('otp')
      }
    } catch {
      setError('Server xatosi')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (otpCode: string, targetEmail?: string) => {
    if (otpCode.length !== 6) {
      setError('6 raqamli kod kiriting')
      return
    }
    setLoading(true)
    setError('')
    try {
      const verifyEmail = targetEmail || email
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: verifyEmail, code: otpCode }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setUser(data.user)
        setToken(data.token)
        navigate('home')
      }
    } catch {
      setError('Server xatosi')
    } finally {
      setLoading(false)
    }
  }

  // Google modal handlers
  const handleGoogleClick = async () => {
    // Agar haqiqiy Google OAuth sozlangan bo'lsa - to'g'ridan-to'g'ri Google ga yo'naltirish
    if (googleReady === true) {
      window.location.href = '/api/auth/google/authorize'
      return
    }

    // Aks holda demo modal ko'rsatish
    setShowGoogleModal(true)
    setGoogleStep('chooser')
    setGoogleSelected(null)
    setError('')

    // Fetch accounts
    setGoogleLoading(true)
    try {
      const res = await fetch('/api/auth/google/accounts')
      const data = await res.json()
      setGoogleAccounts(data.accounts || [])
    } catch {
      setGoogleAccounts([])
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleSelectAccount = async (account: GoogleAccount) => {
    setGoogleSelected(account)
    setError('')

    // OTP yuborish
    setLoading(true)
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: account.email }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setSentOtp(data.otp)
        setEmail(account.email)
        setOtp('')
        setGoogleStep('verify')
      }
    } catch {
      setError('Server xatosi')
    } finally {
      setLoading(false)
    }
  }

  const handleNewGoogleAccount = () => {
    closeGoogleModal()
    // Focus email input
    setTimeout(() => {
      const input = document.querySelector('input[type="email"]') as HTMLInputElement
      if (input) input.focus()
    }, 300)
  }

  const closeGoogleModal = () => {
    setShowGoogleModal(false)
    setGoogleStep('chooser')
    setGoogleSelected(null)
    setOtp('')
    setError('')
    setSentOtp('')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950/30 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 text-4xl shadow-lg shadow-purple-500/30"
          >
            🎬
          </motion.div>
          <h1 className="text-3xl font-bold text-white">AnimeUZ</h1>
          <p className="mt-2 text-gray-400">
            O&apos;zbekistondagi eng yaxshi anime platformasi
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Minglab anime, o&apos;zbek tilida subtitrlar va Premium imkoniyatlar
          </p>
        </div>

        {/* Auth Card */}
        <div className="rounded-2xl border border-white/5 bg-gray-900/80 p-6 shadow-2xl backdrop-blur-xl">
          <AnimatePresence mode="wait">
            {step === 'email' ? (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <h2 className="mb-1 text-lg font-semibold text-white">Xush kelibsiz!</h2>
                <p className="mb-6 text-sm text-gray-400">
                  Davom etish uchun hisobingizni tanlang
                </p>

                {/* Google button */}
                <button
                  onClick={handleGoogleClick}
                  className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-white/10 hover:border-white/20 active:scale-[0.98]"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google orqali kirish
                </button>

                <div className="mb-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-xs text-gray-500">yoki email orqali</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendOTP(email)}
                      className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-gray-600 focus:border-purple-500"
                    />
                  </div>

                  {error && <p className="text-sm text-red-400">{error}</p>}

                  <Button
                    onClick={() => {
                      if (!email) { setError('Email kiriting'); return }
                      handleSendOTP(email)
                    }}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-500 to-violet-600 text-white hover:from-purple-600 hover:to-violet-700"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Yuborilmoqda...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Kod yuborish
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="mb-1 text-lg font-semibold text-white">Tasdiqlash kodi</h2>
                <p className="mb-6 text-sm text-gray-400">
                  {email} manziliga kod yuborildi
                </p>

                <div className="mb-4 flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => {
                      setOtp(value)
                      setError('')
                    }}
                    onComplete={() => handleVerifyOTP(otp)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="border-white/10 bg-white/5 text-white" />
                      <InputOTPSlot index={1} className="border-white/10 bg-white/5 text-white" />
                      <InputOTPSlot index={2} className="border-white/10 bg-white/5 text-white" />
                    </InputOTPGroup>
                    <InputOTPSeparator className="text-gray-600" />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} className="border-white/10 bg-white/5 text-white" />
                      <InputOTPSlot index={4} className="border-white/10 bg-white/5 text-white" />
                      <InputOTPSlot index={5} className="border-white/10 bg-white/5 text-white" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {/* Demo OTP display */}
                {sentOtp && (
                  <div className="mb-4 rounded-lg border border-purple-500/20 bg-purple-500/10 p-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-xs text-purple-300">
                      <Sparkles className="h-3 w-3" />
                      Demo kod: <span className="font-bold text-purple-200">{sentOtp}</span>
                    </div>
                  </div>
                )}

                {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

                <Button
                  onClick={() => handleVerifyOTP(otp)}
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-gradient-to-r from-purple-500 to-violet-600 text-white hover:from-purple-600 hover:to-violet-700"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Tasdiqlanmoqda...
                    </span>
                  ) : (
                    'Tasdiqlash'
                  )}
                </Button>

                <button
                  onClick={() => {
                    setStep('email')
                    setOtp('')
                    setError('')
                  }}
                  className="mt-3 w-full text-sm text-gray-400 hover:text-white"
                >
                  ← Boshqa email
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ===== Google Account Chooser Modal (Dark Theme) ===== */}
      <AnimatePresence>
        {showGoogleModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeGoogleModal}
              className="fixed inset-0 z-[100] bg-[#1F1F1F]/95 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              className="fixed left-1/2 top-1/2 z-[101] w-full max-w-[450px] -translate-x-1/2 -translate-y-1/2"
            >
              <div className="overflow-hidden rounded-lg border border-[#3C4043] bg-[#202124] shadow-[0_2px_24px_rgba(0,0,0,0.3)]">
                <div className="px-6 py-6 sm:px-8 sm:py-8">
                  <AnimatePresence mode="wait">
                    {googleStep === 'chooser' ? (
                      <motion.div
                        key="chooser"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {/* Google Logo */}
                        <div className="mb-3 flex items-center gap-2">
                          <svg className="h-6 w-6" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                        </div>

                        {/* Title */}
                        <p className="mb-1 text-base text-[#E8EAED]">Google hisobingiz bilan kirish</p>

                        {/* App Name */}
                        <p className="mb-6 text-base font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                          AnimeUZ
                        </p>

                        {/* Heading */}
                        <h3 className="mb-1 text-2xl font-bold text-white">Hisobni tanlang</h3>
                        <p className="mb-6 text-sm text-[#9AA0A6]">AnimeUZ ilovasiga o&apos;tish</p>

                        {/* Accounts list */}
                        {googleLoading ? (
                          <div className="flex justify-center py-8">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#8AB4F8] border-t-transparent" />
                          </div>
                        ) : (
                          <div className="space-y-0">
                            {googleAccounts.map((account, index) => (
                              <div key={account.id}>
                                {index > 0 && <div className="border-t border-[#3C4043]" />}
                                <button
                                  onClick={() => handleSelectAccount(account)}
                                  className="flex w-full items-center gap-4 rounded-md px-2 py-3 text-left transition-colors hover:bg-[#3C4043]"
                                >
                                  {/* Avatar */}
                                  {account.avatar ? (
                                    <img
                                      src={account.avatar}
                                      alt=""
                                      className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div
                                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium text-white"
                                      style={{ backgroundColor: getAvatarColor(account.email) }}
                                    >
                                      {(account.name || account.email)[0].toUpperCase()}
                                    </div>
                                  )}

                                  {/* Name & Email */}
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-base text-[#E8EAED]">{account.name}</p>
                                    <p className="truncate text-sm text-[#9AA0A6]">{account.email}</p>
                                  </div>
                                </button>
                              </div>
                            ))}

                            {/* Boshqa hisobdan foydalanish */}
                            {googleAccounts.length > 0 && (
                              <div className="border-t border-[#3C4043]" />
                            )}
                            <button
                              onClick={handleNewGoogleAccount}
                              className="flex w-full items-center gap-4 rounded-md px-2 py-3 text-left transition-colors hover:bg-[#3C4043]"
                            >
                              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#3C4043]">
                                <UserPlus className="h-5 w-5 text-[#8AB4F8]" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-[#8AB4F8]">Boshqa hisobdan foydalanish</p>
                              </div>
                            </button>
                          </div>
                        )}

                        {/* Footer */}
                        <p className="mt-6 text-xs leading-relaxed text-[#9AA0A6]">
                          Bu ilovani ishlatishdan oldin AnimeUZ{' '}
                          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#8AB4F8] hover:underline">maxfiylik siyosati</a> va{' '}
                          <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="text-[#8AB4F8] hover:underline">xizmat shartlari</a> bilan tanishib chiqing.
                        </p>
                      </motion.div>
                    ) : (
                      /* ===== Google Verify OTP Step ===== */
                      <motion.div
                        key="verify"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {/* Google Logo */}
                        <div className="mb-3 flex items-center gap-2">
                          <svg className="h-6 w-6" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          <button
                            onClick={() => { setGoogleStep('chooser'); setOtp(''); setError('') }}
                            className="ml-auto rounded-full p-1 text-[#9AA0A6] transition-colors hover:bg-[#3C4043] hover:text-white"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>

                        {/* Selected account info */}
                        <p className="mb-1 text-base text-[#E8EAED]">Google hisobingiz bilan kirish</p>
                        <p className="mb-6 text-base font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                          AnimeUZ
                        </p>

                        <h3 className="mb-1 text-2xl font-bold text-white">Tasdiqlash</h3>
                        <p className="mb-6 text-sm text-[#9AA0A6]">
                          {googleSelected?.email} manziliga kod yuborildi
                        </p>

                        {/* OTP Input */}
                        <div className="mb-4 flex justify-center">
                          <InputOTP
                            maxLength={6}
                            value={otp}
                            onChange={(value) => {
                              setOtp(value)
                              setError('')
                            }}
                            onComplete={() => handleVerifyOTP(otp, email)}
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} className="h-12 w-11 border-[#3C4043] bg-[#3C4043] text-xl text-white focus:border-[#8AB4F8]" />
                              <InputOTPSlot index={1} className="h-12 w-11 border-[#3C4043] bg-[#3C4043] text-xl text-white focus:border-[#8AB4F8]" />
                              <InputOTPSlot index={2} className="h-12 w-11 border-[#3C4043] bg-[#3C4043] text-xl text-white focus:border-[#8AB4F8]" />
                            </InputOTPGroup>
                            <InputOTPSeparator className="text-[#3C4043]" />
                            <InputOTPGroup>
                              <InputOTPSlot index={3} className="h-12 w-11 border-[#3C4043] bg-[#3C4043] text-xl text-white focus:border-[#8AB4F8]" />
                              <InputOTPSlot index={4} className="h-12 w-11 border-[#3C4043] bg-[#3C4043] text-xl text-white focus:border-[#8AB4F8]" />
                              <InputOTPSlot index={5} className="h-12 w-11 border-[#3C4043] bg-[#3C4043] text-xl text-white focus:border-[#8AB4F8]" />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>

                        {/* Demo OTP */}
                        {sentOtp && (
                          <div className="mb-4 rounded-md border border-[#3C4043] bg-[#2A2A2A] p-3 text-center">
                            <div className="flex items-center justify-center gap-1.5 text-xs text-[#9AA0A6]">
                              <Sparkles className="h-3 w-3 text-[#8AB4F8]" />
                              Demo kod: <span className="font-bold text-[#E8EAED]">{sentOtp}</span>
                            </div>
                          </div>
                        )}

                        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

                        <Button
                          onClick={() => handleVerifyOTP(otp, email)}
                          disabled={loading || otp.length !== 6}
                          className="w-full bg-[#8AB4F8] text-[#202124] font-medium hover:bg-[#aecbfa]"
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#202124] border-t-transparent" />
                              Tasdiqlanmoqda...
                            </span>
                          ) : (
                            'Tasdiqlash va kirish'
                          )}
                        </Button>

                        <button
                          onClick={() => { setGoogleStep('chooser'); setOtp(''); setError('') }}
                          className="mt-3 flex w-full items-center justify-center gap-1 text-sm text-[#8AB4F8] hover:underline"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" />
                          Boshqa hisob tanlash
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
