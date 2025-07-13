// server side

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import MindmapClient from './MindmapClient'

// This server-side function gets the mindmap id from the dynamic route param 'id'
export default async function MindmapPage({params}: {params: Promise<{ id: string }>}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) redirect('/login');

  // get all mindmap data for the user. frontend only sends the mindmap id
  const mindmapRes = await fetch(`http://hfcs.csclub.uwaterloo.ca:8000/get_mindmap_data?id=${id}`, {
    method: 'GET',
  });

  if (!mindmapRes.ok) redirect('/dashboard');

  // Fetch mindmap's data: {id, title, nodes, createdBy, createdAt}
  const mindmapData = await mindmapRes.json();

  return (
    // passes server-fetched mindmap data to the client component, which hydrates Zustand and renders the graph
    <MindmapClient mindmap={mindmapData} />
  );
}

/* THIS IS WHAT THE BACKEND RETURNS IN GET_MINDMAP_DATA

{
  "id": "123",
  "name": "My Cool Mindmap",
  "created_by": "user-uuid",
  "created_at": "2025-06-15T17:00:00Z",
  "nodes": [
    {
      "id": 1,
      "mindmap_id": 123,
      "parent_id": null,
      "content": "My Cool Mindmap",
      "created_by": "user-uuid",
      "x": 400,
      "y": 300
    },
    ...
  ]
}

*/