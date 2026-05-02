'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { BarChart3, Plus, Calendar, Users, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

type AdminTab = 'stats' | 'add-anime' | 'schedule' | 'users'

const tabs: { id: AdminTab; label: string; icon: any }[] = [
  { id: 'stats', label: 'Statistika', icon: BarChart3 },
  { id: 'add-anime', label: 'Anime qo\'shish', icon: Plus },
  { id: 'schedule', label: 'Rejalashtirish', icon: Calendar },
  { id: 'users', label: 'Foydalanuvchilar', icon: Users },
]

export default function AdminSidebar({ children }: { children: (tab: AdminTab) => React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<AdminTab>('stats')
  const { navigate } = useAppStore()

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('home')} className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold text-white">Admin Panel</h1>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full border-b border-white/5 p-2 md:w-56 md:border-b-0 md:border-r md:p-0">
            <div className="flex gap-1 overflow-x-auto md:flex-col md:gap-1 md:p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 md:p-6">{children(activeTab)}</div>
        </div>
      </div>
    </div>
  )
}
