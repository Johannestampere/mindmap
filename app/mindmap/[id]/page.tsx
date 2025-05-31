// server side component

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import MindmapClient from './MindmapClient'

type Params = {
  params: { mindmapId: string }
}

export default async function MindmapPage({ params }: Params) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) redirect('/login')

  const userId = user.id

  // get username from backend
  const usernameRes = await fetch('http://hfcs.csclub.uwaterloo.ca:8000/get_username', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: userId }),
  })
  const { username } = await usernameRes.json()

  // get all mindmap data for the user
  const mindmapRes = await fetch('http://hfcs.csclub.uwaterloo.ca:8000/get_mindmap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mindmapId: params.mindmapId }),
  })

  if (!mindmapRes.ok) redirect('/dashboard')
  const mindmapData = await mindmapRes.json()

  return (
    <MindmapClient
      mindmap={mindmapData}
    />
  )
}
