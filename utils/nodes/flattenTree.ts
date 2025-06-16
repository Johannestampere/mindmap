import type { HierarchyNode } from "./hierarchy";

export function flattenTree(node: HierarchyNode): { id: string; x: number; y: number }[] {
    const result: { id: string; x: number; y: number }[] = [];
  
    function dfs(n: HierarchyNode) {
      result.push({ id: n.id, x: n.x, y: n.y });
      for (const child of n.children) {
        dfs(child);
      }
    }
  
    dfs(node);
    return result;
}