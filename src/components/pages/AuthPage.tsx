'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Mail, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp'
import { motion, AnimatePresence } from 'framer-motion'

export default function AuthPage() {
  const { setUser, setToken } = useAppStore()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [sentOtp, setSentOtp] = useState('')
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
      }
    } catch {
      setError('Server xatosi')
    } finally {
      setLoading(false)
    }
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
                  Davom etish uchun emailingizni kiriting
                </p>

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
                    onComplete={(value) => handleVerifyOTP(value)}
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
    </div>
  )
}
