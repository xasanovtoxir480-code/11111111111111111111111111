'use client'

import { useAppStore } from '@/lib/store'
import { Home, Search, Grid3X3, Heart, User } from 'lucide-react'

const navItems = [
  { id: 'home' as const, icon: Home, label: 'Bosh sahifa' },
  { id: 'search' as const, icon: Search, label: 'Qidirish' },
  { id: 'categories' as const, icon: Grid3X3, label: 'Kategoriyalar' },
  { id: 'favorites' as const, icon: Heart, label: 'Sevimlilar' },
  { id: 'profile' as const, icon: User, label: 'Profil' },
]

export default function BottomNav() {
  const { currentPage, navigate, isAuthenticated } = useAppStore()

  if (currentPage === 'auth' || currentPage === 'watch' || currentPage === 'admin') return null

  const handleNav = (id: string) => {
    if (!isAuthenticated && (id === 'favorites' || id === 'profile')) {
      navigate('auth')
      return
    }
    navigate(id as any)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-gray-950/90 backdrop-blur-xl md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                isActive ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
