'use client'

import { useState, useEffect, useRef } from 'react'
import { useAppStore } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, Trash2, Loader2, User } from 'lucide-react'

interface CommentData {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    name: string | null
    avatar: string | null
  }
}

interface CommentSectionProps {
  animeId: string
}

export default function CommentSection({ animeId }: CommentSectionProps) {
  const { user, token, isAuthenticated } = useAppStore()
  const [comments, setComments] = useState<CommentData[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/anime/${animeId}/comments`)
      const data = await res.json()
      setComments(data.comments || [])
    } catch {
      setComments([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [animeId])

  const handleSubmit = async () => {
    if (!newComment.trim()) return
    if (!token) {
      setError('Tizimga kiring')
      return
    }

    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch(`/api/anime/${animeId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment.trim() }),
      })

      const data = await res.json()

      if (res.ok && data.comment) {
        setComments((prev) => [data.comment, ...prev])
        setNewComment('')
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto'
        }
      } else {
        setError(data.error || 'Xatolik yuz berdi')
      }
    } catch (err) {
      console.error('Comment submit error:', err)
      setError('Internet bilan muammo')
    } finally {
      setSubmitting(false)
    }
  }

  // Xatolik xabarini 5 soniyadan keyin o'chirish
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const handleDelete = async (commentId: string) => {
    if (!token) return

    setDeletingId(commentId)
    try {
      const res = await fetch(
        `/api/anime/${animeId}/comments?commentId=${commentId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== commentId))
      }
    } catch {
      // error
    } finally {
      setDeletingId(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleTextareaInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    const diffHour = Math.floor(diffMs / 3600000)
    const diffDay = Math.floor(diffMs / 86400000)

    if (diffMin < 1) return 'Hozir'
    if (diffMin < 60) return `${diffMin} daqiqa oldin`
    if (diffHour < 24) return `${diffHour} soat oldin`
    if (diffDay < 7) return `${diffDay} kun oldin`
    return date.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const getInitials = (name: string | null) => {
    if (!name) return '?'
    return name.charAt(0).toUpperCase()
  }

  return (
    <div className="mt-8">
      {/* Sarlavha */}
      <div className="mb-4 flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-purple-400" />
        <h2 className="text-lg font-bold text-white">
          Izohlar ({comments.length})
        </h2>
      </div>

      {/* Izoh yozish formasi */}
      {isAuthenticated && user ? (
        <div className="mb-6 rounded-xl border border-white/10 bg-gray-900/50 p-4">
          <div className="flex gap-3">
            {/* Avatar */}
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-sm font-bold text-purple-400">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
              ) : (
                getInitials(user.name)
              )}
            </div>

            {/* Input */}
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={handleKeyDown}
                onInput={handleTextareaInput}
                placeholder="Izoh yozing..."
                rows={1}
                maxLength={500}
                className="w-full resize-none rounded-lg border border-white/10 bg-gray-800/50 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/20"
              />

              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-600">
                  {newComment.length}/500
                </span>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!newComment.trim() || submitting || !token}
                  className="flex items-center gap-1.5 rounded-lg bg-purple-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-40 active:scale-95"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Yuborish
                </button>
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-xs text-red-400"
                >
                  {error}
                </motion.p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 rounded-xl border border-white/5 bg-gray-900/30 p-4 text-center">
          <p className="text-sm text-gray-500">
            Izoh yozish uchun{' '}
            <button
              onClick={() => useAppStore.getState().navigate('auth')}
              className="text-purple-400 hover:text-purple-300 hover:underline"
            >
              tizimga kiring
            </button>
          </p>
        </div>
      )}

      {/* Izohlar ro'yxati */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
        </div>
      ) : comments.length === 0 ? (
        <div className="flex flex-col items-center py-8 text-center">
          <MessageCircle className="mb-3 h-10 w-10 text-gray-700" />
          <p className="text-sm text-gray-500">Hali izohlar yo&apos;q</p>
          <p className="mt-1 text-xs text-gray-600">
            Birinchi izohni siz yozing!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {comments.map((comment) => {
              const isOwn = user && comment.user.id === user.id
              const isAdmin = user?.isAdmin
              const canDelete = isOwn || isAdmin

              return (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="rounded-xl border border-white/5 bg-gray-900/30 p-3.5"
                >
                  <div className="flex gap-3">
                    {/* Avatar */}
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-800 text-xs font-bold text-gray-400">
                      {comment.user.avatar ? (
                        <img src={comment.user.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="truncate text-sm font-semibold text-white">
                            {comment.user.name || 'Foydalanuvchi'}
                          </span>
                          {isOwn && (
                            <span className="flex-shrink-0 rounded bg-purple-500/20 px-1.5 py-0.5 text-[10px] font-medium text-purple-300">
                              Siz
                            </span>
                          )}
                        </div>
                        <span className="flex-shrink-0 text-xs text-gray-600">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-gray-300 whitespace-pre-wrap break-words">
                        {comment.content}
                      </p>

                      {/* O'chirish tugmasi */}
                      {canDelete && (
                        <div className="mt-2 flex justify-end">
                          <button
                            onClick={() => handleDelete(comment.id)}
                            disabled={deletingId === comment.id}
                            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray-600 transition-all hover:bg-red-500/10 hover:text-red-400"
                          >
                            {deletingId === comment.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                            O&apos;chirish
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
