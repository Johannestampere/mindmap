'use client'

import { useEffect } from 'react'
import { useUserStore } from '@/stores/userStore'
import { useMindmapStore } from '@/stores/mindmapStore'
import type { MindmapNode } from '@/stores/mindmapStore'

type User = {
  userId: string
  email: string
  username: string
}

type Mindmap = {
  id: string
  name: string
  created_by: string
  created_at: string
  nodes: MindmapNode[]
}

type Props = {
  mindmap: Mindmap
}

export default function MindmapClient({ mindmap }: Props) {
  const username = useUserStore((s) => s.username)
  const setMindmap = useMindmapStore((s) => s.setMindmap)

  useEffect(() => {
    setMindmap({
      id: mindmap.id,
      name: mindmap.name,
      nodes: mindmap.nodes,
      createdBy: mindmap.created_by,
      createdAt: mindmap.created_at,
    })
  }, [mindmap])

  return (
    <div>
      mindmap graph goes here
    </div>
  )
}
