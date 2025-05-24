// Zustand is used to have access to local states globally
"use client"

import { create } from "zustand"

type UserState = {
    userId: string | null
    email: string | null
    username: string | null
    setUser: (userId: string, email: string, username: string) => void
    clearUser: () => void
  }
  
  export const useUserStore = create<UserState>((set) => ({
    userId: null,
    email: null,
    username: null,
    setUser: (userId, email, username) => set({ userId, email, username }),
    clearUser: () => set({ userId: null, email: null, username: null }),
  }))