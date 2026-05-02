'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { AnimatePresence, motion } from 'framer-motion'
import AuthPage from '@/components/pages/AuthPage'
import HomePage from '@/components/pages/HomePage'
import SearchPage from '@/components/pages/SearchPage'
import CategoriesPage from '@/components/pages/CategoriesPage'
import AnimeDetailPage from '@/components/pages/AnimeDetailPage'
import WatchPage from '@/components/pages/WatchPage'
import FavoritesPage from '@/components/pages/FavoritesPage'
import ProfilePage from '@/components/pages/ProfilePage'
import AdminPanel from '@/components/pages/AdminPanel'
import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
        <p className="text-sm text-gray-400">Yuklanmoqda...</p>
      </motion.div>
    </div>
  )
}

export default function Home() {
  const { currentPage, isHydrating, hydrate } = useAppStore()

  useEffect(() => {
    hydrate()
  }, [hydrate])

  const showNav = currentPage !== 'auth' && currentPage !== 'watch'
  const showBottomNav = currentPage !== 'auth' && currentPage !== 'watch' && currentPage !== 'admin'

  // Show loading while hydrating (checking session on page reload)
  if (isHydrating) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {showNav && <Navbar />}
      <AnimatePresence mode="wait">
        {currentPage === 'auth' && <AuthPage key="auth" />}
        {currentPage === 'home' && <HomePage key="home" />}
        {currentPage === 'search' && <SearchPage key="search" />}
        {currentPage === 'categories' && <CategoriesPage key="categories" />}
        {currentPage === 'anime-detail' && <AnimeDetailPage key="anime-detail" />}
        {currentPage === 'watch' && <WatchPage key="watch" />}
        {currentPage === 'favorites' && <FavoritesPage key="favorites" />}
        {currentPage === 'profile' && <ProfilePage key="profile" />}
        {currentPage === 'admin' && <AdminPanel key="admin" />}
      </AnimatePresence>
      {showBottomNav && <BottomNav />}
    </div>
  )
}
