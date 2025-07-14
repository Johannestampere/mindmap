'use client'

import { useState } from 'react'
import { useMindmapStore } from '@/stores/mindmapStore'
import { useUserStore } from '@/stores/userStore'
import type { MindmapNode } from '@/stores/mindmapStore'

type Props = {
  mindmapId: string
}

// pass Mindmap ID via props from MindmapClient.tsx
export default function AddNodeForm({ mindmapId }: Props) {
  const [content, setContent] = useState('');

  const activeNodeId = useMindmapStore((s) => s.activeNodeId);
  const nodes = useMindmapStore((s) => s.nodes);
  const setNodes = useMindmapStore((s) => s.setNodes);
  const userId = useUserStore((s) => s.userId);

  const handleAddNode = async () => {
    if (!content.trim() || !activeNodeId || !userId) {
      alert('parent node not clicked OR no content inserted => cannot create new node');
      return;
    }

    const res = await fetch('http://hfcs.csclub.uwaterloo.ca:8000/create_node', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mindmapId,
        content,
        parentId: activeNodeId,
        userId,
      }),
    })

    if (!res.ok) {
      alert('error creating new node');
      return;
    }

    const newNode: MindmapNode = await res.json();
    setNodes([...nodes, newNode]);
    setContent('');
  }

  return (
    <div>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="enter new node content"
      />
      <button onClick={handleAddNode}>Add Node</button>
    </div>
  )
}
