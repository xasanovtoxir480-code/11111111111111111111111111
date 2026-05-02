'use client'

import { useState, useEffect } from 'react'
import { useAppStore, AnimeItem } from '@/lib/store'
import AnimeCarousel from '@/components/anime/AnimeCarousel'
import AnimeCard from '@/components/anime/AnimeCard'
import { motion } from 'framer-motion'
import { Calendar, TrendingUp, Loader2 } from 'lucide-react'

export default function HomePage() {
  const { navigate } = useAppStore()
  const [topAnime, setTopAnime] = useState<AnimeItem[]>([])
  const [scheduledAnime, setScheduledAnime] = useState<AnimeItem[]>([])
  const [popularAnime, setPopularAnime] = useState<AnimeItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [topRes, scheduledRes, popularRes] = await Promise.all([
          fetch('/api/anime/top'),
          fetch('/api/anime/scheduled'),
          fetch('/api/anime?sort=date&limit=12'),
        ])

        const topData = await topRes.json()
        const scheduledData = await scheduledRes.json()
        const popularData = await popularRes.json()

        setTopAnime(topData.anime || topData || [])
        setScheduledAnime(scheduledData.anime || scheduledData || [])
        setPopularAnime(popularData.anime || popularData || [])
      } catch (err) {
        console.error('Failed to fetch home data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-950"
    >
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-4 md:px-6">
        {/* Hero Carousel */}
        {topAnime.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <AnimeCarousel anime={topAnime} />
          </motion.section>
        )}

        {/* Scheduled Anime */}
        {scheduledAnime.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-400" />
              <h2 className="text-lg font-bold text-white">Rejalashtirilgan</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {scheduledAnime.map((anime, i) => (
                <motion.div
                  key={anime.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative flex-shrink-0"
                >
                  {anime.scheduledAt && (
                    <div className="absolute -left-1 -top-1 z-10 rounded-lg bg-purple-500 px-2 py-0.5 text-xs font-bold text-white shadow-lg">
                      {formatDate(anime.scheduledAt)}
                    </div>
                  )}
                  <div onClick={() => { useAppStore.getState().setSelectedAnime(anime); navigate('anime-detail') }} className="cursor-pointer">
                    <AnimeCard anime={anime} index={i} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Popular Anime */}
        {popularAnime.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <h2 className="text-lg font-bold text-white">Yangi qo&apos;shilgan</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {popularAnime.map((anime, i) => (
                <AnimeCard key={anime.id} anime={anime} index={i} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Empty State */}
        {!loading && topAnime.length === 0 && popularAnime.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg text-gray-500">Hali animelar mavjud emas</p>
            <p className="mt-1 text-sm text-gray-600">Tez orada yangi animelar qo&apos;shiladi</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
