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
  hydrate: () => void
}

export const useAppStore = create<AppState>((set, get) => ({
  currentPage: 'auth',
  previousPage: null,
  selectedAnime: null,
  selectedEpisode: 1,
  searchQuery: '',
  user: null,
  isAuthenticated: false,
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

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setToken: (token) => {
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('anime_token', token)
      } else {
        localStorage.removeItem('anime_token')
      }
    }
    set({ token })
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('anime_token')
    }
    set({ user: null, isAuthenticated: false, token: null, currentPage: 'auth', selectedAnime: null, favorites: [] })
  },

  setFavorites: (ids) => set({ favorites: ids }),

  toggleFavorite: (id) => {
    const favs = get().favorites
    if (favs.includes(id)) {
      set({ favorites: favs.filter((f) => f !== id) })
    } else {
      set({ favorites: [...favs, id] })
    }
  },

  hydrate: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('anime_token')
      if (token) {
        set({ token })
        // Verify token by fetching user
        fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.user) {
              set({ user: data.user, isAuthenticated: true, currentPage: 'home' })
            } else {
              localStorage.removeItem('anime_token')
              set({ token: null })
            }
          })
          .catch(() => {
            localStorage.removeItem('anime_token')
            set({ token: null })
          })
      }
      // Fetch favorites if authenticated
      const currentState = get()
      if (currentState.isAuthenticated || token) {
        fetch('/api/favorites', {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.favorites) {
              set({ favorites: data.favorites.map((f: any) => f.animeId) })
            }
          })
          .catch(() => {})
      }
    }
  },
}))
