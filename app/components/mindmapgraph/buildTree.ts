// function to build the tree structure from a flat array of MindmapNodes

type MindmapNode = {
    id: string
    mindmapId: string
    content: string
    parentId: string | null
    likedBy: string[]
    children?: MindmapNode[]
}

const buildTree = (nodes: MindmapNode[]): MindmapNode[] => {
    const nodeMap = new Map<string, MindmapNode & { children: MindmapNode[] }>();
    const roots: MindmapNode[] = [];
  
    nodes.forEach((node) => {
      nodeMap.set(node.id, { ...node, children: [] });
    });
  
    nodes.forEach((node) => {
      if (node.parentId) {
        const parent = nodeMap.get(node.parentId);
        parent?.children?.push(nodeMap.get(node.id)!);
      } else {
        roots.push(nodeMap.get(node.id)!); // root node's parent is null
      }
    });
  
    return roots;
}
