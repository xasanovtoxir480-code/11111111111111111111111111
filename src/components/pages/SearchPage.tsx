'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAppStore, AnimeItem } from '@/lib/store'
import AnimeCard from '@/components/anime/AnimeCard'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Loader2, TrendingUp } from 'lucide-react'
import { Input } from '@/components/ui/input'

const POPULAR_TAGS = [
  'Naruto', 'One Piece', 'Dragon Ball', 'Demon Slayer', 'Jujutsu Kaisen',
  'Attack on Titan', 'My Hero Academia', 'Spy x Family', 'Solo Leveling',
  'Bleach', 'Tokyo Revengers', 'Chainsaw Man', 'Haikyuu', 'Death Note',
]

export default function SearchPage() {
  const { searchQuery, setSearchQuery, navigate } = useAppStore()
  const [query, setQuery] = useState(searchQuery)
  const [results, setResults] = useState<AnimeItem[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([])
      setSearched(false)
      return
    }
    setLoading(true)
    setSearched(true)
    try {
      const res = await fetch(`/api/anime/search?q=${encodeURIComponent(q.trim())}`)
      const data = await res.json()
      setResults(data.anime || data || [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleInputChange = (val: string) => {
    setQuery(val)
    setSearchQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(val), 300)
  }

  const handleTagClick = (tag: string) => {
    handleInputChange(tag)
  }

  const handleClear = () => {
    setQuery('')
    setSearchQuery('')
    setResults([])
    setSearched(false)
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gray-950"
    >
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-4 md:px-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
          <Input
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Anime qidirish..."
            className="h-12 rounded-xl border-white/10 bg-gray-900 pl-12 pr-12 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {/* Loading */}
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-12"
            >
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </motion.div>
          )}

          {/* Search Results */}
          {!loading && searched && query.trim() && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {results.length > 0 ? (
                <>
                  <p className="mb-4 text-sm text-gray-400">
                    &laquo;{query.trim()}&raquo; bo&apos;yicha {results.length} ta natija topildi
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {results.map((anime, i) => (
                      <AnimeCard key={anime.id} anime={anime} index={i} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Search className="mb-4 h-12 w-12 text-gray-700" />
                  <p className="text-lg font-medium text-gray-400">Natija topilmadi</p>
                  <p className="mt-1 text-sm text-gray-600">
                    Boshqa kalit so&apos;z bilan qidirib ko&apos;ring
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Default - Popular Tags */}
          {!loading && !searched && !query.trim() && (
            <motion.div
              key="trending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-400" />
                <h2 className="text-lg font-bold text-white">Eng ko&apos;p qidirilgan</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TAGS.map((tag, i) => (
                  <motion.button
                    key={tag}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => handleTagClick(tag)}
                    className="rounded-full border border-white/10 bg-gray-900 px-4 py-2 text-sm text-gray-300 transition-all hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-purple-300"
                  >
                    {tag}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
