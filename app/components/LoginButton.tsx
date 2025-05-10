'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

export default function LoginButton() {
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const supabase = await createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }

    checkSession()
  }, [])

  return (
    <button>
        <span>Authenticate</span>
    </button>
  )
}