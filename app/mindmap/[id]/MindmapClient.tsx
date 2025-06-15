'use client'

import { use, useEffect } from 'react'
import { useMindmapStore } from '@/stores/mindmapStore'
import type { MindmapNode } from '@/stores/mindmapStore'
import AddNodeForm from '@/app/components/AddNodeForm'
import { supabase } from '@/utils/supabase/client'

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

// gets all the mindmap info from the server-side page.tsx
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

  // Realtime sync
  useEffect(() => {
    const channel = supabase
      .channel('mindmap-realtime') // opens a new Realtime channel w/ an ID
      .on(
        'postgres_changes', // listen to correct changes
        {
          event: '*', // listen to all three events
          schema: 'public',
          table: 'nodes',
          filter: `mindmap_id=eq.${mindmap.id}`, // only receive changes for these nodes. eq => equals
        },
        (payload: any) => { // every change, supabase sends a payload, which includes metadata and the old/new row
          const { eventType, new: newNode, old: oldNode } = payload;
  
          if (eventType === 'INSERT') {
            useMindmapStore.setState((s) => ({
              nodes: [...s.nodes, newNode],
            }));
          }
  
          if (eventType === 'UPDATE') {
            useMindmapStore.setState((s) => ({
              nodes: s.nodes.map((node) =>
                node.id === newNode.id ? newNode : node
              ),
            }));
          }
  
          if (eventType === 'DELETE') {
            useMindmapStore.setState((state) => ({
              nodes: state.nodes.filter((node) => node.id !== oldNode.id),
            }));
          }
        }
      )
      .subscribe();
  
    return () => {
      supabase.removeChannel(channel);
    };
  }, [mindmap.id]);
  

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
