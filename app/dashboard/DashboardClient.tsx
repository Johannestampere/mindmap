"use client"

import { JSX, useEffect } from "react"
import { useUserStore } from "@/stores/userStore"

type Props = {
    userId: string
    email: string
    username: string
  }

export default function DashboardClient({userId, email, username}: Props): null {
    const setUser = useUserStore((state) => state.setUser)

    useEffect(() => {
        setUser({ userId, email, username })
      }, [userId, email, username, setUser])

    return null
}

// any client side page can now get the userinfo from the store like:
//  const { username } = useUserStore()
// and when the user logs out, we need to do
//  useUserStore.getState().clearUser()

