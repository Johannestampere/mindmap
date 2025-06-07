'use client'

import { useEffect } from 'react'
import { useUserStore } from '@/stores/userStore'
import { useMindmapStore } from '@/stores/mindmapStore'
import type { MindmapNode } from '@/stores/mindmapStore'

type Mindmap = {
  id: string
  name: string
  created_by: string
  created_at: string
  nodes: MindmapNode[]
};

type Props = {
  mindmap: Mindmap
};

export default function MindmapClient({ mindmap }: Props) {
  const setMindmap = useMindmapStore((s) => s.setMindmap);

  {/* after initial render, store the server-passed mindmap into the Zustand store for global client-side access */}
  useEffect(() => {
    setMindmap({
      id: mindmap.id,
      name: mindmap.name,
      nodes: mindmap.nodes,
      createdBy: mindmap.created_by,
      createdAt: mindmap.created_at,
    })
  }, [mindmap]);

  return (
    <div>
      mindmap graph goes here
    </div>
  )
}