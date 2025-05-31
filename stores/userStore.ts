// User store

"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

type UserState = {
  userId: string | null
  email: string | null
  username: string | null
  setUser: (user: {
    userId: string
    email: string
    username: string
  }) => void
  clearUser: () => void
}

// Zustand store for user state management
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: null,
      email: null,
      username: null,
      setUser: ({ userId, email, username }) =>
        set({ userId, email, username }),
      clearUser: () =>
        set({ userId: null, email: null, username: null }),
    }),
    {
      name: 'user-storage',
    }
  )
)

