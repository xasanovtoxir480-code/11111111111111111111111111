'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAppStore, AnimeItem } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import { Play } from 'lucide-react'

interface AnimeCarouselProps {
  anime: AnimeItem[]
}

export default function AnimeCarousel({ anime }: AnimeCarouselProps) {
  const { navigate, setSelectedAnime, setSelectedEpisode } = useAppStore()
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % anime.length)
  }, [anime.length])

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + anime.length) % anime.length)
  }, [anime.length])

  useEffect(() => {
    if (anime.length <= 1) return
    intervalRef.current = setInterval(next, 5000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [next, anime.length])

  const handleClick = (a: AnimeItem) => {
    setSelectedAnime(a)
    navigate('anime-detail')
  }

  const handleWatch = (e: React.MouseEvent, a: AnimeItem) => {
    e.stopPropagation()
    setSelectedAnime(a)
    setSelectedEpisode(1)
    navigate('watch')
  }

  if (anime.length === 0) return null

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          onClick={() => handleClick(anime[currentIndex])}
          className="relative aspect-video w-full cursor-pointer overflow-hidden rounded-2xl sm:aspect-[16/8] md:aspect-[21/9]"
        >
          <img
            src={anime[currentIndex]?.logo || ''}
            alt={anime[currentIndex]?.title || ''}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
            <div className="flex flex-wrap gap-2 mb-2">
              {(anime[currentIndex]?.genres || '').split(',').filter(Boolean).map((genre) => (
                <span
                  key={genre}
                  className="rounded-full bg-purple-500/30 px-3 py-1 text-xs font-medium text-purple-200 backdrop-blur-sm"
                >
                  {genre.trim()}
                </span>
              ))}
            </div>
            <h2 className="text-xl font-bold text-white md:text-3xl">
              {anime[currentIndex]?.title}
            </h2>
            <p className="mt-1 text-sm text-gray-300 md:text-base">
              {anime[currentIndex]?.year} • {anime[currentIndex]?.isOngoing ? 'Davom etmoqda' : 'Tugallangan'}
            </p>
            <button
              onClick={(e) => handleWatch(e, anime[currentIndex])}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-purple-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:bg-purple-400 hover:shadow-purple-400/40 active:scale-95 md:text-base"
            >
              <Play className="h-4 w-4 fill-white" />
              Korish
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {anime.length > 1 && (
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5 md:bottom-4">
          {anime.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentIndex ? 'w-6 bg-purple-500' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
