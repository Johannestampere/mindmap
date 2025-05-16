'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string

  const { data: signUpData, error: error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error || !signUpData?.user) {
    redirect('/error')
  }

  // retrieve the user's ID from auth.users
  const { id, email: userEmail } = signUpData.user

  // send userid, email, username to backend
  const res = await fetch("/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id, // UUID
      email: userEmail, // varchar
      username, // varchar
    }),
  })

  if (!res.ok) {
    // handle error
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}