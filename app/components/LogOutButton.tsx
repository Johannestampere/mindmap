"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

export default function LogOutButton() {
  const router = useRouter()

  const handleClick = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <button className="bg-gray-400" onClick={handleClick}>
      <span>Log out</span>
    </button>
  )
}