'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { motion } from 'framer-motion'
import {
  User, Copy, Check, Crown, Wallet, Download, LogOut, Trash2,
  Loader2, ArrowLeft, Send, ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

const PREMIUM_PLANS = [
  { months: 1, price: "25,000", label: "1 oy" },
  { months: 3, price: "65,000", label: "3 oy" },
  { months: 6, price: "120,000", label: "6 oy" },
  { months: 12, price: "200,000", label: "12 oy" },
]

interface DownloadItem {
  id: string
  animeId: string
  animeTitle: string
  episodeNumber: number
  createdAt: string
}

export default function ProfilePage() {
  const { user, token, navigate, logout } = useAppStore()
  const [copied, setCopied] = useState(false)
  const [premiumLoading, setPremiumLoading] = useState(false)
  const [downloads, setDownloads] = useState<DownloadItem[]>([])
  const [downloadsLoading, setDownloadsLoading] = useState(false)
  const [premiumOpen, setPremiumOpen] = useState(false)

  useEffect(() => {
    if (!user || !token) {
      navigate('auth')
      return
    }
    fetchDownloads()
  }, [user, token, navigate])

  const fetchDownloads = async () => {
    if (!token) return
    setDownloadsLoading(true)
    try {
      const res = await fetch('/api/downloads', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setDownloads(data.downloads || data || [])
    } catch {
      setDownloads([])
    } finally {
      setDownloadsLoading(false)
    }
  }

  const handleCopyId = () => {
    if (user?.userId) {
      navigator.clipboard.writeText(user.userId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handlePurchasePremium = async (months: number) => {
    if (!token) return
    setPremiumLoading(true)
    try {
      const res = await fetch('/api/profile/premium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ months }),
      })
      const data = await res.json()
      if (data.user) {
        useAppStore.getState().setUser(data.user)
        setPremiumOpen(false)
      }
    } catch (err) {
      console.error('Failed to purchase premium:', err)
    } finally {
      setPremiumLoading(false)
    }
  }

  const handleDeleteDownload = async (animeId: string) => {
    if (!token) return
    try {
      await fetch(`/api/downloads/${animeId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      setDownloads((prev) => prev.filter((d) => d.animeId !== animeId))
    } catch {
      // silent fail
    }
  }

  const handleLogout = async () => {
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        })
      } catch {
        // silent
      }
    }
    logout()
  }

  const handleDeleteAccount = async () => {
    if (!token) return
    try {
      await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      logout()
    } catch (err) {
      console.error('Failed to delete account:', err)
    }
  }

  if (!user) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gray-950"
    >
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-4 md:px-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('home')}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-white">Profil</h1>
        </div>

        <div className="space-y-4">
          {/* User Info Card */}
          <Card className="border-white/5 bg-gray-900">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-purple-500/20">
                  <User className="h-8 w-8 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-white">{user.name || 'Foydalanuvchi'}</h2>
                  <p className="text-sm text-gray-400">{user.email}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <code className="rounded-lg bg-gray-800 px-3 py-1 text-xs text-gray-300">
                      ID: {user.userId}
                    </code>
                    <button
                      onClick={handleCopyId}
                      className="rounded-lg bg-gray-800 p-1.5 text-gray-400 transition-colors hover:text-purple-400"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Balance & Premium Card */}
          <Card className="border-white/5 bg-gray-900">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wallet className="h-5 w-5 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">Balans</p>
                    <p className="text-xl font-bold text-white">{user.balance?.toLocaleString() || 0} so&apos;m</p>
                  </div>
                </div>
                <Button disabled className="bg-gray-800 text-gray-500">
                  Pul qo&apos;shish
                  <span className="ml-2 text-[10px]">(Tez orada)</span>
                </Button>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl bg-gray-800/50 p-3">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-400" />
                  <span className="text-sm text-gray-300">Premium</span>
                </div>
                {user.isPremium ? (
                  <Badge className="bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30">
                    <ShieldCheck className="mr-1 h-3 w-3" />
                    Faol
                  </Badge>
                ) : (
                  <Dialog open={premiumOpen} onOpenChange={setPremiumOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-purple-500 text-white hover:bg-purple-600">
                        <Crown className="mr-2 h-4 w-4" />
                        Premiumga a&apos;zo bo&apos;lish
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md border-white/10 bg-gray-900 text-white">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-white">
                          <Crown className="h-5 w-5 text-yellow-400" />
                          Premium tariflar
                        </DialogTitle>
                      </DialogHeader>
                      <div className="mt-2 space-y-4">
                        {/* Benefits */}
                        <div className="rounded-xl bg-gray-800/50 p-4">
                          <h3 className="mb-2 text-sm font-semibold text-gray-300">Premium afzalliklari:</h3>
                          <ul className="space-y-1.5 text-sm text-gray-400">
                            <li className="flex items-start gap-2">
                              <span className="mt-0.5 text-purple-400">✓</span>
                              Barcha epizodlarni bepul ko&apos;rish
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="mt-0.5 text-purple-400">✓</span>
                              Reklamasiz tomosha
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="mt-0.5 text-purple-400">✓</span>
                              Yuqori sifatli video (1080p)
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="mt-0.5 text-purple-400">✓</span>
                              Yangi anime oldindan ko&apos;rish
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="mt-0.5 text-purple-400">✓</span>
                              Offline ko&apos;rish imkoniyati
                            </li>
                          </ul>
                        </div>

                        {/* Plans */}
                        <div className="grid grid-cols-2 gap-3">
                          {PREMIUM_PLANS.map((plan) => (
                            <button
                              key={plan.months}
                              onClick={() => handlePurchasePremium(plan.months)}
                              disabled={premiumLoading}
                              className="flex flex-col items-center gap-1 rounded-xl border border-white/10 bg-gray-800/50 p-4 transition-all hover:border-purple-500 hover:bg-purple-500/10 disabled:opacity-50"
                            >
                              <span className="text-sm font-medium text-gray-300">{plan.label}</span>
                              <span className="text-lg font-bold text-purple-400">{plan.price}</span>
                              <span className="text-[10px] text-gray-500">so&apos;m</span>
                              <span className="mt-1 rounded-lg bg-purple-500 px-3 py-1 text-xs font-medium text-white">
                                Tanlash
                              </span>
                            </button>
                          ))}
                        </div>

                        {/* Telegram */}
                        <a
                          href="https://t.me/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600/20 py-3 text-sm font-medium text-blue-400 transition-colors hover:bg-blue-600/30"
                        >
                          <Send className="h-4 w-4" />
                          Telegram orqali murojaat
                        </a>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              {user.isPremium && user.premiumExpiry && (
                <p className="mt-2 text-xs text-gray-500">
                  Muddati: {new Date(user.premiumExpiry).toLocaleDateString('uz-UZ')}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Downloads Card */}
          <Card className="border-white/5 bg-gray-900">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-white">
                <Download className="h-5 w-5 text-purple-400" />
                Yuklanganlar
              </CardTitle>
            </CardHeader>
            <CardContent>
              {downloadsLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
                </div>
              ) : downloads.length > 0 ? (
                <div className="space-y-2">
                  {downloads.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-xl bg-gray-800/50 p-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-white">{item.animeTitle}</p>
                        <p className="text-xs text-gray-500">{item.episodeNumber}-qism</p>
                      </div>
                      <button
                        onClick={() => handleDeleteDownload(item.animeId)}
                        className="ml-2 rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-4 text-center text-sm text-gray-600">Hali yuklanganlar yo&apos;q</p>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-white/10 bg-gray-900 text-gray-300 hover:border-white/20 hover:text-white"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Chiqish
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full border-red-500/20 bg-red-500/5 text-red-400 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Akkauntni o&apos;chirish
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border-white/10 bg-gray-900">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">Akkauntni o&apos;chirish</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400">
                    Bu amalni qaytarib bo&apos;lmaydi. Barcha ma&apos;lumotlaringiz, sevimlilar va tarixingiz o&apos;chiriladi. Davom etasizmi?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-white/10 bg-gray-800 text-gray-300 hover:text-white">
                    Bekor qilish
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-red-500 text-white hover:bg-red-600"
                  >
                    O&apos;chirish
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
