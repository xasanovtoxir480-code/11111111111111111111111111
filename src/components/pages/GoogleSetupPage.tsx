'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { ArrowLeft, Copy, Check, ExternalLink, AlertTriangle, Shield, Key, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

const STEPS = [
  {
    icon: Globe,
    title: 'Google Cloud Console\'ga kiring',
    description: 'Google Cloud Console (console.cloud.google.com) sahifasiga o\'ting va Google hisobingiz bilan kirish.',
    action: 'https://console.cloud.google.com',
    actionText: 'Google Cloud Console ochish',
  },
  {
    icon: Key,
    title: 'Yangi loyiha yarating',
    description: '"Select a project" tugmasini bosing -> "New Project" -> Loyiha nomini kiriting (masalan: "AnimeUZ") -> "Create" tugmasini bosing.',
    action: null,
    actionText: null,
  },
  {
    icon: Shield,
    title: 'OAuth consent screen sozlang',
    description: 'Navigation menu -> "APIs & Services" -> "OAuth consent screen" -> "External" tanlang -> "Create" tugmasini bosing. App name: "AnimeUZ", User support email: sizning emailingiz, Developer contact email: sizning emailingiz. Keyin "Save and Continue" tugmalarini bosib o\'ting.',
    action: null,
    actionText: null,
  },
  {
    icon: Key,
    title: 'OAuth 2.0 Credentials yarating',
    description: '"APIs & Services" -> "Credentials" -> "+ CREATE CREDENTIALS" -> "OAuth client ID" ni bosing. Application type: "Web application". Name: "AnimeUZ Web Client". Authorized redirect URIs: quyidagi URL ni qo\'shing.',
    action: null,
    actionText: null,
  },
  {
    icon: AlertTriangle,
    title: 'Redirect URI ni qo\'shing',
    description: 'OAuth client ID yaratish sahifasida "Authorized redirect URIs" bo\'limiga quyidagi URL ni qo\'shing. Bu URL o\'zgarishsiz qolishi kerak!',
    action: null,
    actionText: null,
  },
]

export default function GoogleSetupPage() {
  const { navigate } = useAppStore()
  const [copied, setCopied] = useState<string | null>(null)

  const redirectUri = `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/api/auth/google/callback`

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950/30 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* Back button */}
        <button
          onClick={() => navigate('auth')}
          className="mb-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Orqaga qaytish
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-3xl shadow-lg shadow-blue-500/30">
            <svg className="h-8 w-8" viewBox="0 0 24 24">
              <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Google OAuth Sozlash</h1>
          <p className="mt-2 text-gray-400">
            Google orqali kirish imkoniyatini yoqish uchun quyidagi qadamlarni bajaring
          </p>
        </motion.div>

        {/* Redirect URI box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5"
        >
          <p className="mb-2 text-sm font-medium text-blue-300">Redirect URI (Google Cloud Console\'ga qo\'shing)</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded-lg bg-gray-900 px-4 py-3 text-sm text-green-400 font-mono break-all">
              {redirectUri}
            </code>
            <button
              onClick={() => handleCopy(redirectUri, 'uri')}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              {copied === 'uri' ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </motion.div>

        {/* Env variables box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5"
        >
          <p className="mb-3 text-sm font-medium text-purple-300">.env fayliga quyidagilarni qo\'shing:</p>
          <div className="relative">
            <code className="block rounded-lg bg-gray-900 p-4 text-xs text-gray-300 font-mono whitespace-pre overflow-x-auto">
{`GOOGLE_CLIENT_ID= sizning-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET= sizning-client-secret
GOOGLE_REDIRECT_URI=${redirectUri}`}
            </code>
            <button
              onClick={() => handleCopy(
                `GOOGLE_CLIENT_ID=sizning-client-id.apps.googleusercontent.com\nGOOGLE_CLIENT_SECRET=sizning-client-secret\nGOOGLE_REDIRECT_URI=${redirectUri}`,
                'env'
              )}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white transition-colors"
            >
              {copied === 'env' ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
            </button>
          </div>
        </motion.div>

        {/* Steps */}
        <div className="space-y-4">
          {STEPS.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.08 }}
              className="rounded-xl border border-white/5 bg-gray-900/60 p-5 backdrop-blur"
            >
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/5">
                  <span className="text-sm font-bold text-purple-400">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{step.title}</h3>
                  <p className="mt-1 text-sm text-gray-400 leading-relaxed">{step.description}</p>
                  {step.action && (
                    <a
                      href={step.action}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {step.actionText}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Final note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5"
        >
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-yellow-400 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-300">Muhim!</p>
              <p className="mt-1 text-sm text-gray-400 leading-relaxed">
                OAuth credentials ni sozlaganingizdan so&apos;ng serverni qayta ishga tushirishingiz kerak bo&apos;ladi. 
                .env faylini o&apos;zgartirgandan keyin &quot;npm run dev&quot; yoki &quot;bun dev&quot; ni qayta ishga tushiring.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Back to login button */}
        <div className="mt-8 text-center">
          <Button
            onClick={() => navigate('auth')}
            variant="outline"
            className="border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
          >
            Kirish sahifasiga qaytish
          </Button>
        </div>
      </div>
    </div>
  )
}
