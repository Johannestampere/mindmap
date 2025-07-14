import type { MindmapNode } from "@/stores/mindmapStore";

// Takes everything from the type MindmapNode and adds a new property called children
export type HierarchyNode = MindmapNode & {
    children: HierarchyNode[]
}

export function hierarchy(flatNodes: MindmapNode[]): HierarchyNode | null {
    const nodeMap: Record<string, HierarchyNode> = {};
    let root: HierarchyNode | null = null;

    for (const node of flatNodes) {
        nodeMap[node.id] = { ...node, children: []};
    }

    for (const node of flatNodes) {
        const wrappedNode = nodeMap[node.id];

        if (node.parentId) {
            nodeMap[node.parentId]?.children.push(wrappedNode);
        } else {
            root = wrappedNode;
        }
    }

    return root;
}

