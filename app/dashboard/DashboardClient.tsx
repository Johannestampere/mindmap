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