// Mindmap store

"use client"

import { create } from "zustand"

type Node = {
    id: string
    parentId: string
    text: string
    user: string
    children: Node[]
}

type Mindmap = {
    ownerId: string
    id: string
    name: string
    nodes: Node[]
}

