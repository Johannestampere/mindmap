"use client"

import { useMindmapStore } from "@/stores/mindmapStore";
import { JSX } from "react";

export default function MindmapGraph(): JSX.Element {
    const nodes = useMindmapStore((state) => state.nodes);

    // Find the root node (node with no parent)
    const rootNode = nodes.find((node) => node.parentId === null);

    if (!rootNode) {
        return <div>No nodes found</div>;
    }

    return (
        <div>
            graph component
        </div>
    )
}