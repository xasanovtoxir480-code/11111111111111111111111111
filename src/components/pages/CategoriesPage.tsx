'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAppStore, AnimeItem } from '@/lib/store'
import AnimeCard from '@/components/anime/AnimeCard'
import { motion, AnimatePresence } from 'framer-motion'
import { Funnel, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const TABS = ['Hammasi', 'Ongoing', 'Tugallangan', 'Eng yangi']

const GENRES = [
  'Action', 'Romance', 'Comedy', 'Fantasy', 'Horror', 'Sci-Fi',
  'Drama', 'Adventure', 'Slice of Life', 'Thriller', 'Mystery', 'Sports', 'Mecha',
]

const YEARS = ['2024', '2023', '2022', '2021', '2020', 'older']

export default function CategoriesPage() {
  const { token } = useAppStore()
  const [activeTab, setActiveTab] = useState('Hammasi')
  const [anime, setAnime] = useState<AnimeItem[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [filterOpen, setFilterOpen] = useState(false)

  const getTabParam = useCallback(() => {
    switch (activeTab) {
      case 'Ongoing': return 'ongoing'
      case 'Tugallangan': return 'completed'
      case 'Eng yangi': return 'newest'
      default: return 'all'
    }
  }, [activeTab])

  const fetchAnime = useCallback(async () => {
    setLoading(true)
    try {
      const status = getTabParam()
      const genre = selectedGenres.join(',')
      const year = selectedYear
      const params = new URLSearchParams()
      params.set('status', status)
      if (genre) params.set('genre', genre)
      if (year) params.set('year', year)
      params.set('sort', 'views')

      const res = await fetch(`/api/anime?${params.toString()}`)
      const data = await res.json()
      setAnime(data.anime || data || [])
    } catch {
      setAnime([])
    } finally {
      setLoading(false)
    }
  }, [activeTab, selectedGenres, selectedYear, getTabParam])

  useEffect(() => {
    fetchAnime()
  }, [fetchAnime])

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    )
  }

  const clearFilters = () => {
    setSelectedGenres([])
    setSelectedYear('')
  }

  const hasActiveFilters = selectedGenres.length > 0 || selectedYear !== ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gray-950"
    >
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-4 md:px-6">
        {/* Tabs Row */}
        <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}

          {/* Filter Button */}
          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`ml-auto shrink-0 gap-2 border-white/10 bg-gray-900 text-gray-300 hover:border-purple-500 hover:text-white ${
                  hasActiveFilters ? 'border-purple-500 text-purple-400' : ''
                }`}
              >
                <Funnel className="h-4 w-4" />
                Filter
                {hasActiveFilters && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-[10px] text-white">
                    {selectedGenres.length + (selectedYear ? 1 : 0)}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[80vh] rounded-t-2xl border-white/10 bg-gray-950">
              <SheetHeader>
                <SheetTitle className="text-left text-white">Filterlar</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-6">
                {/* Genre Filter */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-gray-300">Janrlar</h3>
                  <div className="flex flex-wrap gap-2">
                    {GENRES.map((genre) => (
                      <button
                        key={genre}
                        onClick={() => toggleGenre(genre)}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                          selectedGenres.includes(genre)
                            ? 'bg-purple-500 text-white'
                            : 'border border-white/10 bg-gray-900 text-gray-400 hover:border-purple-500/50 hover:text-white'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Year Filter */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-gray-300">Yil</h3>
                  <div className="flex flex-wrap gap-2">
                    {YEARS.map((year) => (
                      <button
                        key={year}
                        onClick={() => setSelectedYear(selectedYear === year ? '' : year)}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                          selectedYear === year
                            ? 'bg-purple-500 text-white'
                            : 'border border-white/10 bg-gray-900 text-gray-400 hover:border-purple-500/50 hover:text-white'
                        }`}
                      >
                        {year === 'older' ? '2020 dan oldin' : year}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="flex-1 border-white/10 bg-gray-900 text-gray-300 hover:text-white"
                  >
                    Tozalash
                  </Button>
                  <Button
                    onClick={() => setFilterOpen(false)}
                    className="flex-1 bg-purple-500 text-white hover:bg-purple-600"
                  >
                    Qo&apos;llash
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Active Filters Display */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 flex flex-wrap items-center gap-2"
            >
              {selectedGenres.map((g) => (
                <Badge
                  key={g}
                  variant="secondary"
                  className="cursor-pointer gap-1 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                  onClick={() => toggleGenre(g)}
                >
                  {g}
                  <X className="h-3 w-3" />
                </Badge>
              ))}
              {selectedYear && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer gap-1 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                  onClick={() => setSelectedYear('')}
                >
                  {selectedYear === 'older' ? '2020 dan oldin' : selectedYear}
                  <X className="h-3 w-3" />
                </Badge>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          </div>
        )}

        {/* Results Grid */}
        {!loading && anime.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {anime.map((a, i) => (
              <AnimeCard key={a.id} anime={a} index={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && anime.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Funnel className="mb-4 h-12 w-12 text-gray-700" />
            <p className="text-lg font-medium text-gray-400">Anime topilmadi</p>
            <p className="mt-1 text-sm text-gray-600">
              Filterlarni o&apos;zgartirib qayta urinib ko&apos;ring
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
