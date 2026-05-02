'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAppStore, AnimeItem, EpisodeItem } from '@/lib/store'
import AdminSidebar from '@/components/layout/AdminSidebar'
import { motion } from 'framer-motion'
import {
  Plus, Trash2, Loader2, Search, Crown, Wallet, ChevronDown, ChevronUp,
  Eye, Users, PlayCircle, DollarSign, Film, Calendar,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

type AdminTab = 'stats' | 'add-anime' | 'schedule' | 'users' | 'ongoing'

export default function AdminPanel() {
  const { token } = useAppStore()

  const authHeaders = useCallback((): Record<string, string> => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }), [token])

  return (
    <AdminSidebar>
      {(activeTab) => (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'stats' && <StatsTab token={token} authHeaders={authHeaders} />}
          {activeTab === 'add-anime' && <AddAnimeTab token={token} authHeaders={authHeaders} />}
          {activeTab === 'schedule' && <ScheduleTab token={token} authHeaders={authHeaders} />}
          {activeTab === 'users' && <UsersTab token={token} authHeaders={authHeaders} />}
          {activeTab === 'ongoing' && <OngoingTab token={token} authHeaders={authHeaders} />}
        </motion.div>
      )}
    </AdminSidebar>
  )
}

/* ==========================================
   STATS TAB
   ========================================== */
function StatsTab({ token, authHeaders }: { token: string | null; authHeaders: () => Record<string, string> }) {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats', { headers: authHeaders() })
        const data = await res.json()
        setStats(data.stats || data)
      } catch {
        setStats(null)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [authHeaders])

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-purple-500" /></div>
  }

  const cards = [
    { label: "Kunlik foyda", value: stats?.dailyRevenue || '0', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: "Premium a'zolar", value: stats?.premiumUsers || '0', icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: "Kunlik tomoshalar", value: stats?.dailyViews || '0', icon: Eye, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: "Jami foydalanuvchilar", value: stats?.totalUsers || '0', icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: "Jami animelar", value: stats?.totalAnime || '0', icon: Film, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Statistika</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.label} className="border-white/5 bg-gray-900">
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`rounded-xl ${card.bg} p-3`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">{card.label}</p>
                  <p className="text-2xl font-bold text-white">{card.value}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

/* ==========================================
   ADD ANIME TAB
   ========================================== */
function AddAnimeTab({ token, authHeaders }: { token: string | null; authHeaders: () => Record<string, string> }) {
  const [animeList, setAnimeList] = useState<AnimeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Anime form state
  const [form, setForm] = useState({
    title: '', titleEn: '', logo: '', cover: '',
    genres: '', year: '2024', description: '', isOngoing: true, videoUrl: '',
  })

  // Episode form state
  const [epForm, setEpForm] = useState({
    number: 1, title: '', videoUrl: '', duration: 1440,
  })
  const [epSubmitting, setEpSubmitting] = useState(false)

  const fetchAnime = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/anime', { headers: authHeaders() })
      const data = await res.json()
      setAnimeList(data.anime || data || [])
    } catch {
      setAnimeList([])
    } finally {
      setLoading(false)
    }
  }, [authHeaders])

  useEffect(() => { fetchAnime() }, [fetchAnime])

  const handleAddAnime = async () => {
    setSubmitting(true)
    try {
      await fetch('/api/anime', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(form),
      })
      setDialogOpen(false)
      setForm({ title: '', titleEn: '', logo: '', cover: '', genres: '', year: '2024', description: '', isOngoing: true, videoUrl: '' })
      fetchAnime()
    } catch (err) {
      console.error('Failed to add anime:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteAnime = async (id: string) => {
    try {
      await fetch(`/api/anime/${id}`, { method: 'DELETE', headers: authHeaders() })
      setAnimeList((prev) => prev.filter((a) => a.id !== id))
    } catch { /* silent */ }
  }

  const handleAddEpisode = async (animeId: string) => {
    setEpSubmitting(true)
    try {
      await fetch(`/api/anime/${animeId}/episodes`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(epForm),
      })
      fetchAnime()
      setEpForm({ number: 1, title: '', videoUrl: '', duration: 1440 })
    } catch { /* silent */ } finally {
      setEpSubmitting(false)
    }
  }

  const handleDeleteEpisode = async (animeId: string, episodeId: string) => {
    try {
      await fetch(`/api/anime/${animeId}/episodes/${episodeId}`, { method: 'DELETE', headers: authHeaders() })
      fetchAnime()
    } catch { /* silent */ }
  }

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-purple-500" /></div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Animelar</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 text-white hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" /> Anime qo&apos;shish
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto border-white/10 bg-gray-900 text-white">
            <DialogHeader>
              <DialogTitle>Yangi anime qo&apos;shish</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Nomi (O&apos;zbekcha)</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Anime nomi" className="mt-1 border-white/10 bg-gray-800 text-white" />
              </div>
              <div>
                <Label>Nomi (Inglizcha)</Label>
                <Input value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} placeholder="English title" className="mt-1 border-white/10 bg-gray-800 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Logo URL</Label>
                  <Input value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} placeholder="https://..." className="mt-1 border-white/10 bg-gray-800 text-white" />
                </div>
                <div>
                  <Label>Cover URL</Label>
                  <Input value={form.cover} onChange={(e) => setForm({ ...form, cover: e.target.value })} placeholder="https://..." className="mt-1 border-white/10 bg-gray-800 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Janrlar (vergul bilan)</Label>
                  <Input value={form.genres} onChange={(e) => setForm({ ...form, genres: e.target.value })} placeholder="Action, Fantasy" className="mt-1 border-white/10 bg-gray-800 text-white" />
                </div>
                <div>
                  <Label>Yil</Label>
                  <Input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2024" className="mt-1 border-white/10 bg-gray-800 text-white" />
                </div>
              </div>
              <div>
                <Label>Tavsif</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Anime haqida..." className="mt-1 border-white/10 bg-gray-800 text-white" rows={3} />
              </div>
              <div>
                <Label>Video URL (1-qism)</Label>
                <Input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://..." className="mt-1 border-white/10 bg-gray-800 text-white" />
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={form.isOngoing} onCheckedChange={(c) => setForm({ ...form, isOngoing: c })} />
                <Label>Davom etmoqda</Label>
              </div>
              <Button onClick={handleAddAnime} disabled={submitting || !form.title} className="w-full bg-purple-500 text-white hover:bg-purple-600">
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Qo&apos;shish
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Anime List */}
      <div className="space-y-3">
        {animeList.map((anime) => {
          const isExpanded = expandedId === anime.id
          return (
            <Card key={anime.id} className="border-white/5 bg-gray-900">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <img src={anime.logo} alt={anime.title} className="h-16 w-12 shrink-0 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h3 className="truncate font-semibold text-white">{anime.title}</h3>
                    <p className="text-xs text-gray-500">{anime.year} • {anime.genres.split(',').slice(0, 3).join(', ')}</p>
                    <div className="mt-1 flex gap-2">
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                        {anime.episodes?.length || 0} qism
                      </Badge>
                      {anime.isOngoing && (
                        <Badge variant="secondary" className="bg-green-500/20 text-green-300">Ongoing</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : anime.id)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => handleDeleteAnime(anime.id)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded: Episodes */}
                {isExpanded && (
                  <div className="mt-4 space-y-3 border-t border-white/5 pt-4">
                    {/* Episode List */}
                    {(anime.episodes || []).length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-300">Epizodlar</h4>
                        {(anime.episodes || []).map((ep: EpisodeItem) => (
                          <div key={ep.id} className="flex items-center justify-between rounded-lg bg-gray-800/50 px-3 py-2">
                            <div>
                              <p className="text-sm text-white">{ep.number}-qism {ep.title ? `— ${ep.title}` : ''}</p>
                              <p className="text-xs text-gray-500">{ep.views} ko&apos;rildi</p>
                            </div>
                            <button
                              onClick={() => handleDeleteEpisode(anime.id, ep.id)}
                              className="rounded p-1 text-gray-500 hover:text-red-400"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Episode Form */}
                    <div className="rounded-xl bg-gray-800/30 p-3">
                      <h4 className="mb-2 text-sm font-medium text-gray-300">Epizod qo&apos;shish</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Qism raqami</Label>
                          <Input
                            type="number"
                            value={epForm.number}
                            onChange={(e) => setEpForm({ ...epForm, number: parseInt(e.target.value) || 1 })}
                            className="mt-0.5 border-white/10 bg-gray-800 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Nomi</Label>
                          <Input
                            value={epForm.title}
                            onChange={(e) => setEpForm({ ...epForm, title: e.target.value })}
                            placeholder="1-qism"
                            className="mt-0.5 border-white/10 bg-gray-800 text-white"
                          />
                        </div>
                      </div>
                      <div className="mt-2">
                        <Label className="text-xs">Video URL</Label>
                        <Input
                          value={epForm.videoUrl}
                          onChange={(e) => setEpForm({ ...epForm, videoUrl: e.target.value })}
                          placeholder="https://..."
                          className="mt-0.5 border-white/10 bg-gray-800 text-white"
                        />
                      </div>
                      <Button
                        onClick={() => handleAddEpisode(anime.id)}
                        disabled={epSubmitting || !epForm.videoUrl}
                        size="sm"
                        className="mt-2 bg-green-600 text-white hover:bg-green-700"
                      >
                        {epSubmitting ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Plus className="mr-1 h-3 w-3" />}
                        Qo&apos;shish
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {animeList.length === 0 && (
        <p className="py-8 text-center text-gray-600">Hali anime qo&apos;shilmagan</p>
      )}
    </div>
  )
}

/* ==========================================
   SCHEDULE TAB
   ========================================== */
function ScheduleTab({ token, authHeaders }: { token: string | null; authHeaders: () => Record<string, string> }) {
  const [animeList, setAnimeList] = useState<AnimeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    title: '', titleEn: '', logo: '', cover: '',
    genres: '', year: '2024', description: '', videoUrl: '',
    scheduledAt: '',
  })

  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/admin/anime?status=scheduled', { headers: authHeaders() })
        const data = await res.json()
        setAnimeList(data.anime || data || [])
      } catch {
        setAnimeList([])
      } finally {
        setLoading(false)
      }
    }
    fetchAnime()
  }, [authHeaders])

  const handleSchedule = async () => {
    setSubmitting(true)
    try {
      await fetch('/api/admin/anime/schedule', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(form),
      })
      setDialogOpen(false)
      setForm({ title: '', titleEn: '', logo: '', cover: '', genres: '', year: '2024', description: '', videoUrl: '', scheduledAt: '' })
      // Refetch
      const res = await fetch('/api/admin/anime?status=scheduled', { headers: authHeaders() })
      const data = await res.json()
      setAnimeList(data.anime || data || [])
    } catch { /* silent */ } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-purple-500" /></div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Rejalashtirilgan</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 text-white hover:bg-green-700">
              <Calendar className="mr-2 h-4 w-4" /> Reja qo&apos;shish
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto border-white/10 bg-gray-900 text-white">
            <DialogHeader>
              <DialogTitle>Yangi anime rejalashtirish</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Nomi</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Anime nomi" className="mt-1 border-white/10 bg-gray-800 text-white" />
              </div>
              <div>
                <Label>Nomi (Inglizcha)</Label>
                <Input value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} placeholder="English title" className="mt-1 border-white/10 bg-gray-800 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Logo URL</Label>
                  <Input value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} placeholder="https://..." className="mt-1 border-white/10 bg-gray-800 text-white" />
                </div>
                <div>
                  <Label>Cover URL</Label>
                  <Input value={form.cover} onChange={(e) => setForm({ ...form, cover: e.target.value })} placeholder="https://..." className="mt-1 border-white/10 bg-gray-800 text-white" />
                </div>
              </div>
              <div>
                <Label>Janrlar</Label>
                <Input value={form.genres} onChange={(e) => setForm({ ...form, genres: e.target.value })} placeholder="Action, Fantasy" className="mt-1 border-white/10 bg-gray-800 text-white" />
              </div>
              <div>
                <Label>Video URL</Label>
                <Input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://..." className="mt-1 border-white/10 bg-gray-800 text-white" />
              </div>
              <div>
                <Label>Tavsif</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Anime haqida..." className="mt-1 border-white/10 bg-gray-800 text-white" rows={3} />
              </div>
              <div>
                <Label>Sanalashtirish (datetime)</Label>
                <Input
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
                  className="mt-1 border-white/10 bg-gray-800 text-white"
                />
              </div>
              <Button onClick={handleSchedule} disabled={submitting || !form.title || !form.scheduledAt} className="w-full bg-purple-500 text-white hover:bg-purple-600">
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calendar className="mr-2 h-4 w-4" />}
                Rejalashtirish
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {animeList.map((anime) => (
          <Card key={anime.id} className="border-white/5 bg-gray-900">
            <CardContent className="flex items-center gap-4 p-4">
              <img src={anime.logo} alt={anime.title} className="h-16 w-12 shrink-0 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <h3 className="truncate font-semibold text-white">{anime.title}</h3>
                <p className="text-xs text-gray-500">{anime.genres}</p>
                {anime.scheduledAt && (
                  <Badge variant="secondary" className="mt-1 bg-purple-500/20 text-purple-300">
                    <Calendar className="mr-1 h-3 w-3" />
                    {new Date(anime.scheduledAt).toLocaleString('uz-UZ')}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {animeList.length === 0 && (
        <p className="py-8 text-center text-gray-600">Rejalashtirilgan anime yo&apos;q</p>
      )}
    </div>
  )
}

/* ==========================================
   USERS TAB
   ========================================== */
function UsersTab({ token, authHeaders }: { token: string | null; authHeaders: () => Record<string, string> }) {
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  // Premium dialog
  const [premiumOpen, setPremiumOpen] = useState(false)
  const [premiumMonths, setPremiumMonths] = useState(1)
  const [premiumUserId, setPremiumUserId] = useState('')
  const [premiumLoading, setPremiumLoading] = useState(false)

  // Transfer dialog
  const [transferOpen, setTransferOpen] = useState(false)
  const [transferAmount, setTransferAmount] = useState('')
  const [transferUserId, setTransferUserId] = useState('')
  const [transferLoading, setTransferLoading] = useState(false)

  const handleSearch = async () => {
    if (!search.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const res = await fetch(`/api/admin/users?search=${encodeURIComponent(search.trim())}`, { headers: authHeaders() })
      const data = await res.json()
      setUsers(data.users || data || [])
    } catch {
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const openPremium = (userId: string) => {
    setPremiumUserId(userId)
    setPremiumMonths(1)
    setPremiumOpen(true)
  }

  const handleGrantPremium = async () => {
    setPremiumLoading(true)
    try {
      await fetch('/api/admin/users/premium', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ userId: premiumUserId, months: premiumMonths }),
      })
      setPremiumOpen(false)
      handleSearch()
    } catch { /* silent */ } finally {
      setPremiumLoading(false)
    }
  }

  const openTransfer = (userId: string) => {
    setTransferUserId(userId)
    setTransferAmount('')
    setTransferOpen(true)
  }

  const handleTransfer = async () => {
    setTransferLoading(true)
    try {
      await fetch('/api/admin/users/transfer', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ userId: transferUserId, amount: parseInt(transferAmount) || 0 }),
      })
      setTransferOpen(false)
      handleSearch()
    } catch { /* silent */ } finally {
      setTransferLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Foydalanuvchilar</h2>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="UserId bo'yicha qidirish..."
            className="pl-10 border-white/10 bg-gray-800 text-white"
          />
        </div>
        <Button onClick={handleSearch} className="bg-purple-500 text-white hover:bg-purple-600">
          Qidirish
        </Button>
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
        </div>
      )}

      {searched && !loading && (
        <div className="space-y-3">
          {users.length > 0 ? (
            users.map((u) => (
              <Card key={u.id} className="border-white/5 bg-gray-900">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{u.name || 'Foydalanuvchi'}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                      <div className="mt-1 flex items-center gap-3 text-sm">
                        <code className="rounded bg-gray-800 px-2 py-0.5 text-xs text-gray-300">ID: {u.userId}</code>
                        <span className="text-gray-400">Balans: {u.balance?.toLocaleString() || 0} so&apos;m</span>
                        {u.isPremium ? (
                          <Badge className="bg-yellow-500/20 text-yellow-300">Premium</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-800 text-gray-500">Oddiy</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                        onClick={() => openPremium(u.userId)}
                      >
                        <Crown className="mr-1 h-3 w-3" /> Premium berish
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                        onClick={() => openTransfer(u.userId)}
                      >
                        <Wallet className="mr-1 h-3 w-3" /> Pul o&apos;tkazish
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="py-8 text-center text-gray-600">Foydalanuvchi topilmadi</p>
          )}
        </div>
      )}

      {!searched && !loading && (
        <p className="py-8 text-center text-gray-600">Foydalanuvchini qidirish uchun userId kiriting</p>
      )}

      {/* Premium Dialog */}
      <Dialog open={premiumOpen} onOpenChange={setPremiumOpen}>
        <DialogContent className="border-white/10 bg-gray-900 text-white">
          <DialogHeader>
            <DialogTitle>Premium berish</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>Davomiylik</Label>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {[1, 3, 6, 12].map((m) => (
                  <button
                    key={m}
                    onClick={() => setPremiumMonths(m)}
                    className={`rounded-xl p-3 text-center text-sm font-medium transition-colors ${
                      premiumMonths === m
                        ? 'bg-purple-500 text-white'
                        : 'border border-white/10 bg-gray-800 text-gray-400 hover:border-purple-500/50'
                    }`}
                  >
                    {m} oy
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={handleGrantPremium} disabled={premiumLoading} className="w-full bg-purple-500 text-white hover:bg-purple-600">
              {premiumLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Tasdiqlash
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transfer Dialog */}
      <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
        <DialogContent className="border-white/10 bg-gray-900 text-white">
          <DialogHeader>
            <DialogTitle>Pul o&apos;tkazish</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>Miqdor (so&apos;m)</Label>
              <Input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="50000"
                className="mt-1 border-white/10 bg-gray-800 text-white"
              />
            </div>
            <Button onClick={handleTransfer} disabled={transferLoading || !transferAmount} className="w-full bg-green-600 text-white hover:bg-green-700">
              {transferLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              O&apos;tkazish
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ==========================================
   ONGOING TAB
   ========================================== */
function OngoingTab({ token, authHeaders }: { token: string | null; authHeaders: () => Record<string, string> }) {
  const [animeList, setAnimeList] = useState<AnimeItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/anime?status=ongoing')
        const data = await res.json()
        setAnimeList(data.anime || data || [])
      } catch {
        setAnimeList([])
      } finally {
        setLoading(false)
      }
    }
    fetchAnime()
  }, [])

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-purple-500" /></div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Davom etayotgan animelar</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {animeList.map((anime) => (
          <Card key={anime.id} className="border-white/5 bg-gray-900">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <img src={anime.logo} alt={anime.title} className="h-20 w-14 shrink-0 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="truncate font-semibold text-white">{anime.title}</h3>
                  <p className="text-xs text-gray-500">{anime.year} • {anime.genres.split(',').slice(0, 3).join(', ')}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                      <PlayCircle className="mr-1 h-3 w-3" />
                      {anime.episodes?.length || 0} qism
                    </Badge>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-300">Ongoing</Badge>
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                    <Eye className="h-3 w-3" />
                    {anime.views} ko&apos;rildi
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {animeList.length === 0 && (
        <p className="py-8 text-center text-gray-600">Davom etayotgan anime yo&apos;q</p>
      )}
    </div>
  )
}
