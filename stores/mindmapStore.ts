'use client'

import { create } from 'zustand'

type MindmapNode = {
  id: string
  content: string
  parentId: string | null
  likedBy: string[]
  children?: MindmapNode[]
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
    toggleLikeNode: (nodeId: string, userId: string) => void
    resetMindmap: () => void
}

export const useMindmapStore = create<MindmapState>((set, get) => ({
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

    // see mingi bs ma pean seda muutma
    toggleLikeNode: (nodeId, userId) => {
        const nodes = get().nodes.map((node) => {
            if (node.id === nodeId) {
                const likedBy = node.likedBy.includes(userId)
                    ? node.likedBy.filter((id) => id !== userId)
                    : [...node.likedBy, userId]
                return { ...node, likedBy }
            }
            return node
        })
        set({ nodes })
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