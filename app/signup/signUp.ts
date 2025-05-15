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

  // insert the id, username, email into the users table under the same ID
  const { error: dbError } = await supabase.from('usersTest').insert({
    id, 
    email: userEmail,
    username,
  })

  if (dbError) {
    console.error(dbError)
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}