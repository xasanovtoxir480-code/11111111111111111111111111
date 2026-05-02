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
  const { navigate, setSelectedAnime, isAuthenticated, favorites, toggleFavorite } = useAppStore()

  const handleClick = () => {
    setSelectedAnime(anime)
    navigate('anime-detail')
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isAuthenticated) return
    toggleFavorite(anime.id)
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
            className="absolute right-2 top-2 rounded-full bg-black/50 p-2 backdrop-blur-sm transition-colors hover:bg-purple-500/50"
          >
            <Heart
              className={`h-4 w-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-white'}`}
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
