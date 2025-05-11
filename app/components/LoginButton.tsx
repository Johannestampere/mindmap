'use client'

import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

export default function LoginButton() {
  console.log("LoginButton clicked")
  const router = useRouter()

  const handleClick = async () => {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (session) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }

  return (
    <button className="bg-gray-400" onClick={handleClick}>
      <span>Log in</span>
    </button>
  )
}