'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAppStore, AnimeItem } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, ChevronLeft, ChevronRight } from 'lucide-react'

interface AnimeCarouselProps {
  anime: AnimeItem[]
}

export default function AnimeCarousel({ anime }: AnimeCarouselProps) {
  const { navigate, setSelectedAnime, setSelectedEpisode } = useAppStore()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % anime.length)
  }, [anime.length])

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + anime.length) % anime.length)
  }, [anime.length])

  useEffect(() => {
    if (anime.length <= 1 || isPaused) return
    intervalRef.current = setInterval(next, 5000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [next, anime.length, isPaused])

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

  const getSlideIndex = (offset: number) => {
    return (currentIndex + offset + anime.length) % anime.length
  }

  if (anime.length === 0) return null

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Asosiy karusel konteyner */}
      <div className="relative w-full">
        {/* Desktop gradientlar */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 hidden h-full w-16 bg-gradient-to-r from-gray-950 to-transparent md:block" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 hidden h-full w-16 bg-gradient-to-l from-gray-950 to-transparent md:block" />

        <div className="flex items-center justify-center">
          {/* Chap slayd - faqat desktop */}
          {anime.length > 1 && (
            <button
              onClick={prev}
              className="relative hidden h-[280px] w-[180px] flex-shrink-0 overflow-hidden rounded-lg opacity-40 transition-opacity hover:opacity-60 md:block lg:h-[340px] lg:w-[220px]"
            >
              <img
                src={anime[getSlideIndex(-1)]?.logo || ''}
                alt=""
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 to-transparent" />
            </button>
          )}

          {/* Asosiy slayd */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              onClick={() => handleClick(anime[currentIndex])}
              className="relative w-full cursor-pointer overflow-hidden md:mx-4 md:rounded-2xl md:shadow-2xl"
            >
              {/* Rasm */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-900 sm:aspect-[16/9] md:aspect-[21/9] md:h-[340px] md:w-auto lg:h-[400px]">
                <img
                  src={anime[currentIndex]?.logo || ''}
                  alt={anime[currentIndex]?.title || ''}
                  className="h-full w-full object-contain"
                />
                {/* Gradient - pastdan tepaga */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
                {/* Gradient - chapdan o'ngga (desktop) */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-950/70 via-transparent to-transparent hidden md:block" />
              </div>

              {/* Mobil overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 md:hidden">
                <h2 className="mb-1 text-2xl font-bold text-white drop-shadow-lg">
                  {anime[currentIndex]?.title}
                </h2>
                <p className="mb-4 text-sm text-gray-300">
                  {anime[currentIndex]?.year} • {(anime[currentIndex]?.genres || '').split(',').filter(Boolean).join(' • ')}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => handleWatch(e, anime[currentIndex])}
                    className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/30 transition-all hover:bg-red-500 active:scale-95"
                  >
                    <Play className="h-4 w-4 fill-white" />
                    TOMOSHA QILISH
                  </button>
                </div>
              </div>

              {/* Desktop overlay */}
              <div className="absolute bottom-8 left-8 right-8 hidden md:block lg:bottom-12 lg:left-12">
                <div className="flex flex-wrap gap-2 mb-3">
                  {(anime[currentIndex]?.genres || '').split(',').filter(Boolean).map((genre) => (
                    <span
                      key={genre}
                      className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-gray-200 backdrop-blur-sm"
                    >
                      {genre.trim()}
                    </span>
                  ))}
                </div>
                <h2 className="mb-2 text-3xl font-bold text-white drop-shadow-lg lg:text-4xl">
                  {anime[currentIndex]?.title}
                </h2>
                <p className="mb-4 text-sm text-gray-300 lg:text-base">
                  {anime[currentIndex]?.year} • {anime[currentIndex]?.isOngoing ? 'Davom etmoqda' : 'Tugallangan'}
                </p>
                <button
                  onClick={(e) => handleWatch(e, anime[currentIndex])}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-base font-bold text-white shadow-lg shadow-red-600/30 transition-all hover:bg-red-500 hover:shadow-red-500/40 active:scale-95"
                >
                  <Play className="h-5 w-5 fill-white" />
                  TOMOSHA QILISH
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* O'ng slayd - faqat desktop */}
          {anime.length > 1 && (
            <button
              onClick={next}
              className="relative hidden h-[280px] w-[180px] flex-shrink-0 overflow-hidden rounded-lg opacity-40 transition-opacity hover:opacity-60 md:block lg:h-[340px] lg:w-[220px]"
            >
              <img
                src={anime[getSlideIndex(1)]?.logo || ''}
                alt=""
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 to-transparent" />
            </button>
          )}
        </div>

        {/* Chap/o'q tugmalari - mobil */}
        {anime.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-2 top-1/2 z-20 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-1.5 shadow-lg transition-all hover:bg-white active:scale-90 md:hidden"
            >
              <ChevronLeft className="h-5 w-5 text-gray-900" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-2 top-1/2 z-20 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-1.5 shadow-lg transition-all hover:bg-white active:scale-90 md:hidden"
            >
              <ChevronRight className="h-5 w-5 text-gray-900" />
            </button>
          </>
        )}

        {/* Chap/o'q tugmalari - desktop */}
        {anime.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-2 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/10 p-2 backdrop-blur-sm transition-all hover:bg-white/20 md:flex lg:left-4"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-2 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/10 p-2 backdrop-blur-sm transition-all hover:bg-white/20 md:flex lg:right-4"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
          </>
        )}
      </div>

      {/* Navigatsiya nuqtalari - faqat mobil */}
      {anime.length > 1 && (
        <div className="flex justify-center gap-1.5 pb-2 pt-3 md:hidden">
          {anime.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentIndex ? 'w-6 bg-red-500' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
