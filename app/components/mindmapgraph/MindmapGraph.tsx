// Use D3 only for layout calculation (x, y positions).
// Render nodes as React DOM components (e.g. div), positioned absolutely in a relative container.

"use client"

import { useMindmapStore } from "@/stores/mindmapStore";
import { JSX } from "react";


export default function MindmapGraph(): JSX.Element {
    return (
        <div>
            the actual graph
        </div>
    )
}