import { create } from 'zustand'
import { sanitizeUser } from './auth'

export type PageType = 'auth' | 'home' | 'search' | 'categories' | 'anime-detail' | 'watch' | 'favorites' | 'profile' | 'admin'

export interface AnimeItem {
  id: string
  title: string
  titleEn: string | null
  logo: string
  cover: string | null
  genres: string
  year: number
  description: string
  isOngoing: boolean
  videoUrl: string | null
  status: string
  scheduledAt: string | null
  views: number
  createdAt: string
  updatedAt: string
  episodes?: EpisodeItem[]
  isFavorited?: boolean
}

export interface EpisodeItem {
  id: string
  animeId: string
  number: number
  title: string | null
  videoUrl: string
  duration: number | null
  views: number
  createdAt: string
}

export interface User {
  id: string
  userId: string
  email: string
  name: string | null
  avatar: string | null
  balance: number
  isPremium: boolean
  premiumExpiry: string | null
  isAdmin: boolean
}

interface AppState {
  currentPage: PageType
  previousPage: PageType | null
  selectedAnime: AnimeItem | null
  selectedEpisode: number
  searchQuery: string
  user: User | null
  isAuthenticated: boolean
  isHydrating: boolean
  favorites: string[]
  token: string | null

  navigate: (page: PageType) => void
  goBack: () => void
  setSelectedAnime: (anime: AnimeItem | null) => void
  setSelectedEpisode: (num: number) => void
  setSearchQuery: (q: string) => void
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  logout: () => void
  setFavorites: (ids: string[]) => void
  toggleFavorite: (id: string) => void
  hydrate: () => Promise<void>
}

function saveToStorage(key: string, value: any) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {}
  }
}

function loadFromStorage<T>(key: string): T | null {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }
  return null
}

export const useAppStore = create<AppState>((set, get) => ({
  currentPage: 'auth',
  previousPage: null,
  selectedAnime: null,
  selectedEpisode: 1,
  searchQuery: '',
  user: null,
  isAuthenticated: false,
  isHydrating: true,
  favorites: [],
  token: null,

  navigate: (page) => {
    const current = get().currentPage
    set({ currentPage: page, previousPage: current !== 'auth' ? current : null })
  },

  goBack: () => {
    const prev = get().previousPage
    if (prev) {
      set({ currentPage: prev, previousPage: null })
    } else {
      set({ currentPage: 'home', previousPage: null })
    }
  },

  setSelectedAnime: (anime) => set({ selectedAnime: anime }),
  setSelectedEpisode: (num) => set({ selectedEpisode: num }),
  setSearchQuery: (q) => set({ searchQuery: q }),

  setUser: (user) => {
    set({ user, isAuthenticated: !!user })
    if (user) {
      saveToStorage('anime_user', user)
    } else {
      if (typeof window !== 'undefined') localStorage.removeItem('anime_user')
    }
  },

  setToken: (token) => {
    set({ token })
    if (token) {
      localStorage.setItem('anime_token', token)
    } else {
      localStorage.removeItem('anime_token')
    }
  },

  logout: () => {
    localStorage.removeItem('anime_token')
    localStorage.removeItem('anime_user')
    set({ user: null, isAuthenticated: false, token: null, currentPage: 'auth', selectedAnime: null, favorites: [] })
  },

  setFavorites: (ids) => {
    set({ favorites: ids })
    saveToStorage('anime_favorites', ids)
  },

  toggleFavorite: (id) => {
    const favs = get().favorites
    const newFavs = favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id]
    set({ favorites: newFavs })
    saveToStorage('anime_favorites', newFavs)
  },

  hydrate: async () => {
    if (typeof window === 'undefined') return

    set({ isHydrating: true })

    // Restore token from localStorage
    const token = localStorage.getItem('anime_token')
    if (!token) {
      set({ isHydrating: false, currentPage: 'auth' })
      return
    }

    set({ token })

    try {
      // Verify token with server
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()

      if (data.user) {
        set({
          user: data.user,
          isAuthenticated: true,
          isHydrating: false,
          currentPage: 'home',
        })
        saveToStorage('anime_user', data.user)

        // Fetch favorites in background
        try {
          const favRes = await fetch('/api/favorites', {
            headers: { Authorization: `Bearer ${token}` },
          })
          const favData = await favRes.json()
          if (favData.favorites) {
            const favIds = favData.favorites.map((f: any) => f.animeId)
            set({ favorites: favIds })
            saveToStorage('anime_favorites', favIds)
          }
        } catch {}
      } else {
        // Token invalid — try to restore from cached user as fallback
        const cachedUser = loadFromStorage<User>('anime_user')
        if (cachedUser) {
          // Still show the cached user while token might be stale
          // Re-create a fresh token
          const reloginRes = await fetch('/api/auth/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: cachedUser.email }),
          })
          const reloginData = await reloginRes.json()

          if (reloginData.otp) {
            // Auto-verify with the new OTP
            const verifyRes = await fetch('/api/auth/verify-otp', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: cachedUser.email, code: reloginData.otp }),
            })
            const verifyData = await verifyRes.json()

            if (verifyData.user && verifyData.token) {
              set({
                user: verifyData.user,
                isAuthenticated: true,
                token: verifyData.token,
                isHydrating: false,
                currentPage: 'home',
              })
              localStorage.setItem('anime_token', verifyData.token)
              saveToStorage('anime_user', verifyData.user)
              return
            }
          }
        }

        // Complete failure — clear everything
        localStorage.removeItem('anime_token')
        localStorage.removeItem('anime_user')
        set({ token: null, user: null, isAuthenticated: false, isHydrating: false, currentPage: 'auth' })
      }
    } catch {
      // Network error — try to use cached user
      const cachedUser = loadFromStorage<User>('anime_user')
      const cachedFavs = loadFromStorage<string[]>('anime_favorites')

      if (cachedUser) {
        set({
          user: cachedUser,
          isAuthenticated: true,
          favorites: cachedFavs || [],
          isHydrating: false,
          currentPage: 'home',
        })
      } else {
        set({ isHydrating: false, currentPage: 'auth' })
      }
    }
  },
}))
