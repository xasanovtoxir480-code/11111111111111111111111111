'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { AnimatePresence } from 'framer-motion'
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

export default function Home() {
  const { currentPage, hydrate } = useAppStore()

  useEffect(() => {
    hydrate()
  }, [hydrate])

  const showNav = currentPage !== 'auth' && currentPage !== 'watch'
  const showBottomNav = currentPage !== 'auth' && currentPage !== 'watch' && currentPage !== 'admin'

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
