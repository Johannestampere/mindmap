'use client'

import { useEffect, useState } from 'react'
import { useMindmapStore } from '@/stores/mindmapStore'
import type { MindmapNode } from '@/stores/mindmapStore'
import AddNodeForm from '@/app/components/AddNodeForm'
import { supabase } from '@/utils/supabase/client'
import * as d3 from "d3";
import { hierarchy } from '@/utils/nodes/hierarchy'
import { flattenTree } from '@/utils/nodes/flattenTree'
import { useUserStore } from '@/stores/userStore'
import { JSX } from 'react'

// TypeScript type for Mindmap
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

// TypeScript type for AI analysis results
type AIAnalysis = {
  ideas: string[];
}

// Node Like button
function LikeButton({ node }: { node: MindmapNode }) {
  const userId = useUserStore((s) => s.userId);
  const isLiked = node.likedBy.includes(userId || '');
  
  const handleLike = async () => {
    if (!userId) return;

    // POST request to like a node
    const res = await fetch('http://hfcs.csclub.uwaterloo.ca:8000/toggle_node_like', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nodeId: node.id,
        userId,
      }),
    });
    
    if (!res.ok) {
      alert('Error liking node');
      return;
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`ml-2 p-1 rounded-full transition-colors ${
        isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill={isLiked ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}

// Function that returns content from Root to CurNode for the AI analysis
async function getNodeSubtree(nodeId: string): Promise<string[]> {
  const res = await fetch(`http://hfcs.csclub.uwaterloo.ca:8000/get_node_path?id=${nodeId}`);
  const data = await res.json();
  return data.nodeContents; // Array of strings in root-to-leaf order
}

// Function that takes node id and displays AI analysis
function AIAnalysis({ nodeId, onClose }: { nodeId: string, onClose: () => void }): JSX.Element {
  const [ideas, setIdeas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const subtree: string[] = await getNodeSubtree(nodeId);

        const res = await fetch('http://hfcs.csclub.uwaterloo.ca:8000/analyze_node', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subtree,
          }),
        });

        if (!res.ok) throw new Error('error getting AI analysis');
        
        const data: AIAnalysis = await res.json();
        setIdeas(data.ideas);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [nodeId]);

  return (
    <div style={{ position: 'fixed', right: 20, top: 20, width: 300, background: 'white', padding: 20, border: '1px solid #ccc' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <div>Ideas for: {nodeId}</div>
        <button onClick={onClose}>×</button>
      </div>

      {loading ? (
        <div>Loading AI ideas...</div>
      ) : ideas.length > 0 ? (
        <ul style={{ margin: 0, padding: 0, listStyle: 'disc', paddingLeft: 20 }}>
          {ideas.map((idea, i) => (
            <li key={i} style={{ marginBottom: 5 }}>{idea}</li>
          ))}
        </ul>
      ) : (
        <div>No ideas generated</div>
      )}
    </div>
  );
}

// Function to render Mindmap
export default function MindmapClient({ mindmap }: Props) {
  const setMindmap = useMindmapStore((s) => s.setMindmap);
  const nodes = useMindmapStore((s) => s.nodes);
  const setActiveNode = useMindmapStore((s) => s.setActiveNode);
  const activeNodeId = useMindmapStore((s) => s.activeNodeId);
  const [showAnalysis, setShowAnalysis] = useState(false);

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

  // D3 tree stuff + sync the new layout to the backend
  useEffect(() => {
    if (nodes.length === 0) return;

    // Use the hierarchy func to turn the flat nodes arr into a hierarchy
    const treeHierarchy = hierarchy(nodes);
    if (!treeHierarchy) return;

    // Turn the tree into a D3 hierarchy
    const d3root = d3.hierarchy(treeHierarchy);

    // Create tree layout w/ a specific canvas size
    const treeLayout = d3.tree<typeof treeHierarchy>().size([800, 600]);
    treeLayout(d3root);

    const updatedNodes: MindmapNode[] = [];

    d3root.each((n) => {
      updatedNodes.push({
        ...n.data,
        x: n.x!,
        y: n.y!,
      })
    })

    // Set the Mindmap state in Zustand
    useMindmapStore.getState().setNodes(updatedNodes);

    const flattenedAgain = flattenTree(treeHierarchy);
    const nodePayload = flattenedAgain.map(({id, x, y}) => ({id, x, y}));

    // POST req to update Node x- and y-positions
    fetch("http://hfcs.csclub.uwaterloo.ca:8000/update_node_positions", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nodes: nodePayload }),
    })
  }, [nodes])
  
  const handleNodeClick = (nodeId: string) => {
    setActiveNode(nodeId);
  };

  return (
    <div>
      {nodes.map((node) => (
        <div
          key={node.id}
          style={{ 
            position: 'absolute', 
            left: node.x, 
            top: node.y,
            padding: '8px 16px',
            borderRadius: '8px',
            backgroundColor: 'white',
            boxShadow: node.id === activeNodeId 
              ? '0 0 15px 5px rgba(66, 153, 225, 0.5)' 
              : node.likedBy.length > 0
                ? `0 0 ${Math.min(node.likedBy.length * 2, 10)}px rgba(239, 68, 68, 0.3)`
                : '0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease-in-out',
            cursor: 'pointer',
            border: '1px solid #e2e8f0',
            transform: `scale(${1 + (node.likedBy.length * 0.05)})`,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
          onClick={() => handleNodeClick(node.id)}
          onMouseEnter={(e) => {
            const buttons = e.currentTarget.querySelector('div');
            if (buttons) buttons.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            const buttons = e.currentTarget.querySelector('div');
            if (buttons) buttons.style.opacity = '0';
          }}
        >
          <span>{node.content}</span>
          <div style={{ 
            display: 'flex', 
            gap: '4px',
            opacity: 0,
            transition: 'opacity 0.2s ease-in-out'
          }}>
            <LikeButton node={node} />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAnalysis(true);
              }}
              style={{ 
                padding: '2px 6px',
                fontSize: '12px',
                background: '#f0f0f0',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              AI Ideas
            </button>
          </div>
        </div>
      ))}

      {showAnalysis && activeNodeId && (
        <AIAnalysis
          nodeId={activeNodeId}
          onClose={() => setShowAnalysis(false)}
        />
      )}

      <AddNodeForm mindmapId={mindmap.id} />
    </div>
  )
}
