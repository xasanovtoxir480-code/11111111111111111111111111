'use client'

import { Play, Lock, Crown } from 'lucide-react'
import { useAppStore } from '@/lib/store'

interface VideoPlayerProps {
  title: string
  episodeNumber: number
  videoUrl?: string | null
  isLocked: boolean
  onPrev?: () => void
  onNext?: () => void
  hasNext?: boolean
}

export default function VideoPlayer({ title, episodeNumber, videoUrl, isLocked, onPrev, onNext, hasNext }: VideoPlayerProps) {
  const { navigate } = useAppStore()

  if (isLocked) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-900">
        {/* Blurred background effect */}
        {videoUrl && (
          <video
            src={videoUrl}
            className="absolute inset-0 h-full w-full object-cover blur-3xl opacity-20"
            muted
          />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-gradient-to-br from-purple-900/30 via-gray-900/90 to-gray-900">
          <div className="rounded-full bg-yellow-500/20 p-6 backdrop-blur-sm">
            <Lock className="h-12 w-12 text-yellow-400" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-white">Premium talab etiladi</h3>
            <p className="mt-2 text-sm text-gray-400">
              {episodeNumber}-qismni ko&apos;rish uchun Premiumga a&apos;zo bo&apos;ling
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Faqat 1-qism bepul ko&apos;rish mumkin
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('profile')}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-yellow-500/25 transition-all hover:shadow-yellow-500/40 hover:scale-105"
            >
              <Crown className="h-4 w-4" />
              Premium sotib olish
            </button>
            <button
              onClick={onPrev}
              className="flex items-center gap-2 rounded-xl bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700"
            >
              ← 1-qismga qaytish
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-900">
        {videoUrl ? (
          <video
            src={videoUrl}
            controls
            autoPlay
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-purple-900/30 to-gray-900">
            <div className="rounded-full bg-purple-500/30 p-6 backdrop-blur-sm">
              <Play className="h-12 w-12 text-purple-400" fill="currentColor" />
            </div>
            <p className="text-sm text-gray-400">Video tez orada qo&apos;shiladi</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-300">
          {title} — {episodeNumber}-qism
          {episodeNumber === 1 && (
            <span className="ml-2 rounded bg-green-500/20 px-1.5 py-0.5 text-[10px] font-medium text-green-400">Tekin</span>
          )}
        </p>
        <div className="flex gap-2">
          <button
            onClick={onPrev}
            className="rounded-lg bg-gray-800 px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700"
          >
            ← Oldingi
          </button>
          {hasNext && (
            <button
              onClick={onNext}
              className="flex items-center gap-1 rounded-lg bg-purple-500 px-3 py-1.5 text-xs text-white hover:bg-purple-600"
            >
              Keyingi →
              {!useAppStore.getState().user?.isPremium && (
                <Lock className="h-3 w-3" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
