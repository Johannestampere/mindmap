'use client'

import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

export default function LoginButton() {
  const router = useRouter();

  const handleClick = async () => {
    const supabase = createClient();
    
    // gets the user's data for the first time
    const { data: { session } } = await supabase.auth.getSession();

    // if the user has an active session, push directly to dashboard
    if (session) {
      router.push('/dashboard')
    } else {
    // if the user has no active session, push to /login
      router.push('/login')
    }
  }

  return (
    <button className="bg-gray-400" onClick={handleClick}>
      <span>Log in</span>
    </button>
  )
}