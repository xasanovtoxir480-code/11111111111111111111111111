'use client'

import { useState, useEffect } from 'react'
import { useAppStore, AnimeItem } from '@/lib/store'
import AnimeCard from '@/components/anime/AnimeCard'
import { motion } from 'framer-motion'
import { Heart, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function FavoritesPage() {
  const { token, navigate } = useAppStore()
  const [favorites, setFavorites] = useState<AnimeItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token) {
        navigate('auth')
        return
      }
      setLoading(true)
      try {
        const res = await fetch('/api/favorites', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        // API returns { favorites: [{ anime: {...}, ... }] }
        // Extract anime objects from favorites array
        if (data.favorites && Array.isArray(data.favorites)) {
          const animeList = data.favorites.map((f: any) => f.anime).filter(Boolean)
          setFavorites(animeList)
        }
      } catch {
        setFavorites([])
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [token, navigate])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gray-950"
    >
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-4 md:px-6">
        <div className="mb-6 flex items-center gap-2">
          <Heart className="h-5 w-5 text-purple-400" fill="currentColor" />
          <h1 className="text-xl font-bold text-white">Sevimlilar</h1>
          {favorites.length > 0 && (
            <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-xs font-medium text-purple-300">
              {favorites.length}
            </span>
          )}
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {favorites.map((anime, i) => (
              <AnimeCard key={anime.id} anime={anime} index={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="mb-4 rounded-full bg-gray-900 p-6">
              <Heart className="h-12 w-12 text-gray-700" />
            </div>
            <p className="text-lg font-semibold text-gray-400">Sevimli anime topilmadi</p>
            <p className="mt-2 text-sm text-gray-600">
              Yoqtirgan animelaringizni qo&apos;shing va ular shu yerda ko&apos;rinishadi
            </p>
            <Button
              onClick={() => navigate('home')}
              className="mt-6 bg-purple-500 text-white hover:bg-purple-600"
            >
              Bosh sahifaga o&apos;tish
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
