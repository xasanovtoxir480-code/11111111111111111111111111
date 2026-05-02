'use client'

import { useState, useEffect } from 'react'
import { useAppStore, EpisodeItem } from '@/lib/store'
import VideoPlayer from '@/components/anime/VideoPlayer'
import EpisodeList from '@/components/anime/EpisodeList'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function WatchPage() {
  const { selectedAnime, selectedEpisode, user, setSelectedEpisode, goBack } = useAppStore()
  const [episodes, setEpisodes] = useState<EpisodeItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!selectedAnime) {
      goBack()
      return
    }

    const fetchEpisodes = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/anime/${selectedAnime.id}/episodes`)
        const data = await res.json()
        setEpisodes(data.episodes || data || [])
      } catch {
        setEpisodes([])
      } finally {
        setLoading(false)
      }
    }

    fetchEpisodes()
  }, [selectedAnime, goBack])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (!selectedAnime) return null

  const currentEpisode = episodes.find((ep) => ep.number === selectedEpisode)
  const isPremium = user?.isPremium || false
  // 1-qism hamma uchun ochiq, 2+ faqat premium uchun
  const isLocked = selectedEpisode > 1 && !isPremium
  const currentIndex = episodes.findIndex((ep) => ep.number === selectedEpisode)
  const hasNext = currentIndex >= 0 && currentIndex < episodes.length - 1

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedEpisode(episodes[currentIndex - 1].number)
    }
  }

  const handleNext = () => {
    if (hasNext) {
      setSelectedEpisode(episodes[currentIndex + 1].number)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-950"
    >
      <div className="mx-auto max-w-5xl px-4 pb-24 md:px-6">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 flex items-center gap-3 bg-gray-950/80 py-3 backdrop-blur-md">
          <Button
            variant="ghost"
            size="icon"
            onClick={goBack}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 truncate">
            <p className="truncate text-sm font-medium text-white">
              {selectedAnime.title} — {selectedEpisode}-qism
            </p>
          </div>
        </div>

        {/* Video Player */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-2"
        >
          <VideoPlayer
            title={selectedAnime.title}
            episodeNumber={selectedEpisode}
            videoUrl={currentEpisode?.videoUrl}
            isLocked={isLocked}
            onPrev={handlePrev}
            onNext={handleNext}
            hasNext={hasNext}
          />
        </motion.div>

        {/* Episode List */}
        {episodes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <h2 className="mb-3 text-sm font-semibold text-gray-300">
              Barcha epizodlar ({episodes.length})
            </h2>
            <div className="max-h-96 overflow-y-auto pr-1 custom-scrollbar">
              <EpisodeList
                episodes={episodes}
                animeId={selectedAnime.id}
                isPremium={isPremium}
                isAuthenticated={!!user}
              />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
