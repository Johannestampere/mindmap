'use client'

import { useEffect } from 'react'
import { useUserStore } from '@/stores/userStore'
import { useMindmapStore } from '@/stores/mindmapStore'

type User = {
  userId: string
  email: string
  username: string
}

type MindmapNode = {
  id: string
  content: string
  parentId: string | null
  likedBy: string[]
  children?: MindmapNode[]
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
  const setUser = useUserStore((s) => s.setUser)
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
    <div className="p-10">
      <h1 className="font-bold">{mindmap.name}</h1>
    </div>
  )
}
