'use client'

import { create } from 'zustand'

// TypeScript type for a singular Node
export type MindmapNode = {
  id: string
  mindmapId: string
  content: string
  parentId: string | null
  likedBy: string[]
  children?: MindmapNode[]
  x: number
  y: number
}

type MindmapState = {
    id: string | null
    name: string | null
    nodes: MindmapNode[] // array of nodes
    createdBy: string | null
    createdAt: string | null
    activeNodeId: string | null
    
    setMindmap: (
        mindmap: {
            id: string
            name: string
            nodes: MindmapNode[]
            createdBy: string
            createdAt: string
        }
    ) => void

    setNodes: (nodes: MindmapNode[]) => void
    setActiveNode: (nodeId: string | null) => void
    resetMindmap: () => void
}

// Function to create a store for managaing Mindmap state
export const useMindmapStore = create<MindmapState>((set) => ({
    id: null,
    name: null,
    nodes: [],
    createdBy: null,
    createdAt: null,
    activeNodeId: null,

    setMindmap: (mindmap) => {
        set({
            id: mindmap.id,
            name: mindmap.name,
            nodes: mindmap.nodes,
            createdBy: mindmap.createdBy,
            createdAt: mindmap.createdAt,
        })
    },

    setNodes: (nodes) => {
        set({ nodes })
    },

    setActiveNode: (nodeId) => {
        set({ activeNodeId: nodeId })
    },

    resetMindmap: () => {
        set({
            id: null,
            name: null,
            nodes: [],
            createdBy: null,
            createdAt: null,
            activeNodeId: null,
        })
    }
}))