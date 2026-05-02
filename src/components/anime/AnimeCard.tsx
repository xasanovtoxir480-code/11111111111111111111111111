'use client'

import { useAppStore, AnimeItem } from '@/lib/store'
import { Heart, Play } from 'lucide-react'
import { motion } from 'framer-motion'

interface AnimeCardProps {
  anime: AnimeItem
  showHeart?: boolean
  index?: number
}

export default function AnimeCard({ anime, showHeart = true, index = 0 }: AnimeCardProps) {
  const { navigate, setSelectedAnime, isAuthenticated, favorites, token } = useAppStore()

  const handleClick = () => {
    setSelectedAnime(anime)
    navigate('anime-detail')
  }

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isAuthenticated || !token) return

    const isFav = favorites.includes(anime.id)

    try {
      if (isFav) {
        // Remove from favorites
        await fetch(`/api/favorites/${anime.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        })
        useAppStore.setState((s) => ({ favorites: s.favorites.filter((id) => id !== anime.id) }))
      } else {
        // Add to favorites
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ animeId: anime.id }),
        })
        useAppStore.setState((s) => ({ favorites: [...s.favorites, anime.id] }))
      }
    } catch (err) {
      console.error('Favorite toggle error:', err)
    }
  }

  const isFav = favorites.includes(anime.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={handleClick}
      className="group relative cursor-pointer overflow-hidden rounded-xl bg-gray-900 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={anime.logo}
          alt={anime.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            ;(e.target as HTMLImageElement).src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" fill="%23111"><rect width="300" height="400"/><text x="150" y="200" text-anchor="middle" fill="%23444" font-size="14">No Image</text></svg>')
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
          <div className="rounded-full bg-purple-500/80 p-3 backdrop-blur-sm">
            <Play className="h-6 w-6 text-white" fill="white" />
          </div>
        </div>

        {/* Favorite button */}
        {showHeart && (
          <button
            onClick={handleFavorite}
            className="absolute right-2 top-2 z-10 rounded-full bg-black/50 p-2 backdrop-blur-sm transition-all hover:bg-purple-500/50 active:scale-90"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${isFav ? 'fill-red-500 text-red-500' : 'text-white'}`}
            />
          </button>
        )}

        {/* Ongoing badge */}
        {anime.isOngoing && (
          <div className="absolute left-2 top-2 rounded-md bg-purple-500/80 px-2 py-0.5 text-xs font-bold text-white backdrop-blur-sm">
            ONGOING
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="truncate text-sm font-semibold text-white">{anime.title}</h3>
        <div className="mt-1 flex flex-wrap gap-1">
          {anime.genres.split(',').slice(0, 2).map((genre) => (
            <span
              key={genre}
              className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] text-purple-300"
            >
              {genre.trim()}
            </span>
          ))}
        </div>
        <p className="mt-1 text-xs text-gray-500">{anime.year}</p>
      </div>
    </motion.div>
  )
}
