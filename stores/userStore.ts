// User store

"use client"

import { create } from "zustand"

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
export const useUserStore = create<UserState>((set) => ({
  // Initialize user state
  userId: null,
  email: null,
  username: null,

  // Functions to set and clear user state
  setUser: ({ userId, email, username }) =>
    set({ userId, email, username }),

  clearUser: () =>
    set({ userId: null, email: null, username: null }),
}))
