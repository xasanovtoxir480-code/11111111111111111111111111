'use client'

import { useAppStore } from '@/lib/store'
import { Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const { currentPage, navigate, user, isAuthenticated } = useAppStore()

  if (currentPage === 'auth' || currentPage === 'watch') return null

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-gray-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-2 text-xl font-bold text-purple-400 transition-colors hover:text-purple-300"
        >
          <span className="text-2xl">🎬</span>
          <span>AnimeUZ</span>
        </button>

        <div className="flex items-center gap-2">
          {isAuthenticated && user?.isAdmin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('admin')}
              className={currentPage === 'admin' ? 'text-purple-400' : 'text-gray-400 hover:text-white'}
            >
              <Shield className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
