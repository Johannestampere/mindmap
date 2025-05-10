// zustand store for managing user state

// Your store is a hook! You can put anything in it: primitives, objects, functions. The set function merges state.

// You can use the hook anywhere, without the need of providers. Select your state and the consuming component will re-render when that state changes.

import { create } from 'zustand'

interface UserState {
  user: any
  setUser: (user: any) => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))