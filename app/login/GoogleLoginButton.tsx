"use client"

import { createClient } from '@/utils/supabase/client'
import { access } from 'fs'
import { redirect } from 'next/navigation'
import React from 'react'

export default function GoogleLoginButton() {
  const handleGoogleLogin = async () => {
      const supabase = await createClient()
      await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `/auth/callback`,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            }
          }
      })
  }

  return (
    <div>
      <button onClick={handleGoogleLogin}>
        google
      </button>
    </div>
  )
}