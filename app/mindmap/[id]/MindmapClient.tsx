'use client'

import { useEffect } from 'react'
import { useUserStore } from '@/stores/userStore'
import { useMindmapStore } from '@/stores/mindmapStore'
import type { MindmapNode } from '@/stores/mindmapStore'
import AddNodeForm from '@/app/components/AddNodeForm'

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
  const nodes = useMindmapStore((s) => s.nodes);
  const setActiveNode = useMindmapStore((s) => s.setActiveNode);

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
      {nodes.map((node) => (
        <div
        key={node.id}
        style={{ position: 'absolute', left: node.x, top: node.y }}
        onClick={() => setActiveNode(node.id)}
        >
        {node.content}
        </div>
      ))}

      <AddNodeForm mindmapId={mindmap.id} />

    </div>
  )
}
