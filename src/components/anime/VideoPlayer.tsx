'use client'

import { Play, Lock } from 'lucide-react'

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
  if (isLocked) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-900">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-purple-900/20 to-gray-900">
          <div className="rounded-full bg-purple-500/20 p-6">
            <Lock className="h-12 w-12 text-purple-400" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-white">Premium talab etiladi</h3>
            <p className="mt-1 text-sm text-gray-400">
              Bu epizodni ko&apos;rish uchun Premiumga a&apos;zo bo&apos;ling
            </p>
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
              className="rounded-lg bg-purple-500 px-3 py-1.5 text-xs text-white hover:bg-purple-600"
            >
              Keyingi →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
