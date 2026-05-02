'use client'

import { useAppStore, EpisodeItem } from '@/lib/store'
import { Lock, Play, Eye, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

interface EpisodeListProps {
  episodes: EpisodeItem[]
  animeId: string
  isPremium: boolean
  isAuthenticated: boolean
}

export default function EpisodeList({ episodes, animeId, isPremium, isAuthenticated }: EpisodeListProps) {
  const { navigate, setSelectedEpisode, setSelectedAnime, selectedAnime } = useAppStore()

  const handlePlay = (ep: EpisodeItem) => {
    if (!isAuthenticated) return
    if (!isPremium && ep.number > 1) return
    setSelectedEpisode(ep.number)
    navigate('watch')
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '--:--'
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-2">
      {episodes.map((ep, i) => {
        const isLocked = !isAuthenticated || (!isPremium && ep.number > 1)
        return (
          <motion.div
            key={ep.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => handlePlay(ep)}
            className={`group flex items-center gap-3 rounded-xl p-3 transition-all ${
              isLocked
                ? 'cursor-not-allowed bg-gray-900/50'
                : 'cursor-pointer bg-gray-900 hover:bg-gray-800'
            }`}
          >
            {/* Episode number */}
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
              isLocked ? 'bg-gray-800 text-gray-600' : 'bg-purple-500/20 text-purple-400'
            }`}>
              {isLocked ? <Lock className="h-4 w-4" /> : ep.number}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {ep.title || `${ep.number}-qism`}
              </p>
              <div className="mt-0.5 flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {ep.views}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDuration(ep.duration)}
                </span>
              </div>
            </div>

            {/* Play button */}
            {!isLocked && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/20 opacity-0 transition-opacity group-hover:opacity-100">
                <Play className="h-4 w-4 text-purple-400" fill="currentColor" />
              </div>
            )}

            {isLocked && (
              <span className="text-[10px] font-medium text-gray-600">Premium</span>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
