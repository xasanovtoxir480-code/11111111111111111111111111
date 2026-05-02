'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Mail, ArrowRight, Sparkles, X, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp'
import { motion, AnimatePresence } from 'framer-motion'

export default function AuthPage() {
  const { setUser, setToken, navigate } = useAppStore()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [sentOtp, setSentOtp] = useState('')
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showGoogleModal, setShowGoogleModal] = useState(false)
  const [googleEmail, setGoogleEmail] = useState('')
  const [googleStep, setGoogleStep] = useState<'account' | 'password' | 'enter-otp'>('account')

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

  const handleVerifyOTP = async (otpCode: string) => {
    if (otpCode.length !== 6) {
      setError('6 raqamli kod kiriting')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otpCode }),
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

  const handleGoogleClick = () => {
    setShowGoogleModal(true)
    setGoogleStep('account')
    setGoogleEmail('')
    setError('')
  }

  const handleGoogleSubmit = () => {
    if (!googleEmail.includes('@gmail.com')) {
      setError('Faqat @gmail.com manzilini kiriting')
      return
    }
    setGoogleStep('password')
    setError('')
  }

  const handleGooglePassword = () => {
    setGoogleStep('enter-otp')
    setError('')
    // Simulating Google sending OTP to the gmail
    handleGoogleSendOTP()
  }

  const handleGoogleSendOTP = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: googleEmail }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setSentOtp(data.otp)
        setEmail(googleEmail)
      }
    } catch {
      setError('Server xatosi')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleVerify = () => {
    // Verify OTP and login
    handleVerifyOTP(otp)
  }

  const closeGoogleModal = () => {
    setShowGoogleModal(false)
    setGoogleStep('account')
    setGoogleEmail('')
    setOtp('')
    setError('')
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
                    onComplete={() => handleVerifyOTP(value)}
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

      {/* Google Sign-In Modal */}
      <AnimatePresence>
        {showGoogleModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeGoogleModal}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-1/2 top-1/2 z-[101] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2"
            >
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a2e] shadow-2xl">
                {/* Header */}
                <div className="relative flex items-center justify-center border-b border-white/5 px-6 py-4">
                  {googleStep !== 'account' && (
                    <button
                      onClick={() => {
                        if (googleStep === 'enter-otp') {
                          setGoogleStep('password')
                          setOtp('')
                        } else if (googleStep === 'password') {
                          setGoogleStep('account')
                        }
                        setError('')
                      }}
                      className="absolute left-3 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                  )}
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-base font-medium text-white">Google bilan kirish</span>
                  </div>
                  <button
                    onClick={closeGoogleModal}
                    className="absolute right-3 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Body */}
                <div className="p-6">
                  <AnimatePresence mode="wait">
                    {googleStep === 'account' && (
                      <motion.div
                        key="g-account"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      >
                        <div className="mb-6 text-center">
                          <h3 className="text-lg font-medium text-white">Hisobni tanlang</h3>
                          <p className="mt-1 text-sm text-gray-400">
                            AnimeUZ ilovasiga kirish uchun Gmail manzilingizni kiriting
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="relative">
                            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="2" y="4" width="20" height="16" rx="2"/>
                              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                            </svg>
                            <Input
                              type="email"
                              placeholder="ismingiz@gmail.com"
                              value={googleEmail}
                              onChange={(e) => setGoogleEmail(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleGoogleSubmit()}
                              className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-gray-600 focus:border-blue-500"
                            />
                          </div>

                          {error && <p className="text-sm text-red-400">{error}</p>}

                          <Button
                            onClick={handleGoogleSubmit}
                            disabled={!googleEmail.includes('@gmail.com')}
                            className="w-full bg-blue-500 text-white hover:bg-blue-600"
                          >
                            Davom etish
                          </Button>

                          <p className="text-center text-xs text-gray-500">
                            Davom etish orqali Xizmat ko&apos;rsatish shartlari va Maxfiylik siyosatiga rozilik bildirasiz
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {googleStep === 'password' && (
                      <motion.div
                        key="g-password"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      >
                        <div className="mb-6 flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-sm font-bold text-white">
                            {googleEmail[0]?.toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-white">{googleEmail}</p>
                            <p className="text-xs text-gray-400">Google hisobi</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="relative">
                            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                            <Input
                              type="password"
                              placeholder="Parol"
                              className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-gray-600 focus:border-blue-500"
                            />
                          </div>

                          {error && <p className="text-sm text-red-400">{error}</p>}

                          <Button
                            onClick={handleGooglePassword}
                            disabled={loading}
                            className="w-full bg-blue-500 text-white hover:bg-blue-600"
                          >
                            {loading ? (
                              <span className="flex items-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Tasdiqlanmoqda...
                              </span>
                            ) : (
                              'Davom etish'
                            )}
                          </Button>

                          <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
                            <p className="text-xs text-amber-300">
                              Bu demo rejim. Haqiqiy Google hisobidan parol so&apos;ralmaydi. OTP kod yuboriladi.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {googleStep === 'enter-otp' && (
                      <motion.div
                        key="g-otp"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      >
                        <div className="mb-2 text-center">
                          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                            <svg className="h-6 w-6 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                              <polyline points="22 4 12 14.01 9 11.01"/>
                            </svg>
                          </div>
                          <h3 className="text-lg font-medium text-white">Google tasdiqlash</h3>
                          <p className="mt-1 text-sm text-gray-400">
                            {googleEmail} manziliga 6 xonali kod yuborildi
                          </p>
                        </div>

                        <div className="mb-4 mt-4 flex justify-center">
                          <InputOTP
                            maxLength={6}
                            value={otp}
                            onChange={(value) => {
                              setOtp(value)
                              setError('')
                            }}
                            onComplete={() => handleGoogleVerify()}
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
                          onClick={handleGoogleVerify}
                          disabled={loading || otp.length !== 6}
                          className="w-full bg-blue-500 text-white hover:bg-blue-600"
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              Tasdiqlanmoqda...
                            </span>
                            ) : (
                            'Tasdiqlash va kirish'
                          )}
                        </Button>
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
