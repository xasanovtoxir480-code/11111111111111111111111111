'use client'

import { useAppStore } from '@/lib/store'
import { Home, Search, Grid3X3, Heart, User, Shield } from 'lucide-react'

export default function DesktopSidebar() {
  const { currentPage, navigate, isAuthenticated, user } = useAppStore()

  if (currentPage === 'auth' || currentPage === 'watch' || currentPage === 'admin') return null

  const isAdmin = isAuthenticated && user?.isAdmin
  const showAdmin = currentPage !== 'admin'

  const navItems = isAdmin && showAdmin ? [
    { id: 'home' as const, icon: Home, label: 'Bosh sahifa' },
    { id: 'search' as const, icon: Search, label: 'Qidirish' },
    { id: 'categories' as const, icon: Grid3X3, label: 'Kategoriyalar' },
    { id: 'favorites' as const, icon: Heart, label: 'Sevimlilar' },
    { id: 'profile' as const, icon: User, label: 'Profil' },
    { id: 'admin' as const, icon: Shield, label: 'Admin' },
  ] : [
    { id: 'home' as const, icon: Home, label: 'Bosh sahifa' },
    { id: 'search' as const, icon: Search, label: 'Qidirish' },
    { id: 'categories' as const, icon: Grid3X3, label: 'Kategoriyalar' },
    { id: 'favorites' as const, icon: Heart, label: 'Sevimlilar' },
    { id: 'profile' as const, icon: User, label: 'Profil' },
  ]

  const handleNav = (id: string) => {
    if (!isAuthenticated && (id === 'favorites' || id === 'profile')) {
      navigate('auth')
      return
    }
    navigate(id as any)
  }

  return (
    <aside className="hidden md:flex md:fixed md:left-0 md:top-14 md:z-40 md:h-[calc(100vh-3.5rem)] md:w-56 md:flex-col md:border-r md:border-white/5 md:bg-gray-950">
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          const isItemAdmin = item.id === 'admin'
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? isItemAdmin
                    ? 'bg-amber-500/15 text-amber-400'
                    : 'bg-purple-500/15 text-purple-400'
                  : isItemAdmin
                    ? 'text-gray-500 hover:bg-amber-500/5 hover:text-amber-300'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              }`}
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                isActive
                  ? isItemAdmin ? 'bg-amber-500/20' : 'bg-purple-500/20'
                  : ''
              }`}>
                <Icon className="h-4 w-4" />
              </div>
              <span>{item.label}</span>
              {isActive && (
                <div className={`ml-auto h-1.5 w-1.5 rounded-full ${
                  isItemAdmin ? 'bg-amber-400' : 'bg-purple-400'
                }`} />
              )}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
