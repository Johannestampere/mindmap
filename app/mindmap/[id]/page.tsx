// server side

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import MindmapClient from './MindmapClient'

type Params = {
  params: { mindmapId: string }
}

export default async function MindmapPage({ params }: Params) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) redirect('/login');
  
  // get username from backend (why?)
  const usernameRes = await fetch('http://hfcs.csclub.uwaterloo.ca:8000/get_username', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: user.id }),
  })

  const username = usernameRes.json();

  // get all mindmap data for the user
  const mindmapRes = await fetch('http://hfcs.csclub.uwaterloo.ca:8000/get_mindmap_data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mindmapId: params.mindmapId }),
  })

  if (!mindmapRes.ok) redirect('/dashboard');

  // fetch mindmap's data: {id, title, nodes, createdBy, createdAt}
  const mindmapData = await mindmapRes.json();

  return (
    // passes server-fetched mindmap data to the client component, which hydrates Zustand and renders the graph
    <MindmapClient mindmap={mindmapData} />
  );
}