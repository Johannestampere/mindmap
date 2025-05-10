// To access Supabase from client components

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    // ! in TS means that trust me, this will not be undefined
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}