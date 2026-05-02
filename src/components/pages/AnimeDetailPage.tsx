'use client'

import { useState, useEffect } from 'react'
import { useAppStore, AnimeItem, EpisodeItem } from '@/lib/store'
import EpisodeList from '@/components/anime/EpisodeList'
import { motion } from 'framer-motion'
import { ArrowLeft, Heart, Play, Eye, Loader2, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function AnimeDetailPage() {
  const { selectedAnime, setSelectedAnime, navigate, goBack, user, token, favorites, toggleFavorite } = useAppStore()
  const [anime, setAnime] = useState<AnimeItem | null>(null)
  const [episodes, setEpisodes] = useState<EpisodeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isFav, setIsFav] = useState(false)

  useEffect(() => {
    if (!selectedAnime) {
      goBack()
      return
    }

    const fetchAnime = async () => {
      setLoading(true)
      try {
        const headers: Record<string, string> = {}
        if (token) headers['Authorization'] = `Bearer ${token}`

        const res = await fetch(`/api/anime/${selectedAnime.id}`, { headers })
        const data = await res.json()
        const animeData = data.anime || data
        setAnime(animeData)
        setEpisodes(animeData.episodes || [])
        setIsFav(favorites.includes(animeData.id))
      } catch (err) {
        console.error('Failed to fetch anime:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnime()

    // Increment views
    fetch(`/api/anime/${selectedAnime.id}/view`, { method: 'POST' }).catch(() => {})
  }, [selectedAnime, token, favorites, goBack])

  const handleFavorite = async () => {
    if (!token || !anime) return

    const wasFav = isFav
    setIsFav(!wasFav)
    toggleFavorite(anime.id)

    try {
      if (wasFav) {
        await fetch(`/api/favorites/${anime.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        })
      } else {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ animeId: anime.id }),
        })
      }
    } catch {
      // Revert on error
      setIsFav(wasFav)
      toggleFavorite(anime.id)
    }
  }

  const handlePlayFirst = () => {
    if (episodes.length > 0) {
      useAppStore.getState().setSelectedEpisode(episodes[0].number)
      navigate('watch')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (!anime) return null

  const isPremium = user?.isPremium || false

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-950"
    >
      <div className="mx-auto max-w-4xl px-4 pb-24 md:px-6">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-gray-950/80 py-3 backdrop-blur-md">
          <Button
            variant="ghost"
            size="icon"
            onClick={goBack}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavorite}
            className="text-gray-400 hover:text-red-500"
          >
            <Heart className={`h-5 w-5 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>

        {/* Cover Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-6 overflow-hidden rounded-2xl"
        >
          <div className="relative aspect-video overflow-hidden">
            <img
              src={anime.cover || anime.logo}
              alt={anime.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/30 to-transparent" />

            {/* Play button overlay */}
            {episodes.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                onClick={handlePlayFirst}
                className="absolute bottom-6 left-6 flex items-center gap-3 rounded-xl bg-purple-500/90 px-5 py-3 text-white backdrop-blur-sm transition-colors hover:bg-purple-600"
              >
                <Play className="h-5 w-5" fill="white" />
                <span className="text-sm font-semibold">Ko&apos;rish</span>
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">{anime.title}</h1>
            {anime.titleEn && (
              <p className="mt-1 text-sm text-gray-500">{anime.titleEn}</p>
            )}
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {anime.views} tomosha
            </span>
            <span>{anime.year}</span>
            <span className={anime.isOngoing ? 'text-green-400' : 'text-gray-400'}>
              {anime.isOngoing ? 'Davom etmoqda' : 'Tugallangan'}
            </span>
            {episodes.length > 0 && (
              <span>{episodes.length} qism</span>
            )}
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {anime.genres.split(',').map((genre) => (
              <Badge
                key={genre}
                variant="secondary"
                className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
              >
                {genre.trim()}
              </Badge>
            ))}
          </div>

          {/* Description */}
          <p className="leading-relaxed text-gray-400">{anime.description}</p>
        </motion.div>

        {/* Episodes */}
        {episodes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <h2 className="mb-4 text-lg font-bold text-white">Epizodlar</h2>
            <EpisodeList
              episodes={episodes}
              animeId={anime.id}
              isPremium={isPremium}
              isAuthenticated={!!user}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
