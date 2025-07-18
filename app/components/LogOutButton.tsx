"use client"

import { useRouter } from "next/navigation"
import { supabase } from "@/utils/supabase/client"
import { useUserStore } from "@/stores/userStore"

export default function LogOutButton() {
  const clearUser = useUserStore((state) => state.clearUser)
  const router = useRouter()

  const handleClick = async () => {
    await supabase.auth.signOut()
    clearUser()
    router.push('/')
  }

  return (
    <button className="bg-gray-400" onClick={handleClick}>
      <span>Log out</span>
    </button>
  )
}