"use client"

import React, { JSX, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function CreateNewMindMapButton(): JSX.Element {
    const router = useRouter()
    const [name, setName] = useState<string>("")

    const handleCreateNewMindmap = async (): Promise<void> => {
        const supabase = createClient()
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            router.push('/login')
            return
        }

        // POST req to backend: send the user id

        const userId = user.id

        const res = await fetch("http://hfcs.csclub.uwaterloo.ca:8000/create_mindmap", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                // UUID of user
                id: userId,
                // Name of mindmap (varchar?)
                name: name,
            }),
        })

        if (!res.ok) {
            console.error("failed to create a new mindmap")
            return;
        }
    }
    
    return (
        <form onSubmit={handleCreateNewMindmap}>
            <input 
                type="text"
                placeholder="Enter new mindmap name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-2 border-black rounded-md"
            />
            <button>Create new mindmap</button>
        </form>
    )
}