'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from "@/stores/userStore"
import React, { JSX } from 'react'

export default function CreateNewMindmapButton(): JSX.Element {
  const router = useRouter();

  // hydrate user
  const userId = useUserStore((state) => state.userId);

  const [newMindmapName, setNewMindmapname] = useState<string>('');
  
  const handleCreateMindmap = async (e: React.FormEvent<HTMLFormElement>) => {
    // prevent default form submission
    e.preventDefault();

    if (!newMindmapName || !userId) {
      alert("error: associated file is CreateNewMindmapButton.tsx");
      return;
    }

    try {
      const res = await fetch("http://hfcs.csclub.uwaterloo.ca:8000/create_mindmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          id: userId,
          title: newMindmapName,
        }),
      });

      if (!res.ok) {
        throw new Error("failed to create mindmap");
      }

      const mindmapId = await res.json();

      router.push(`/mindmap/${mindmapId}`);
    } catch (e) {
      console.error("error creating mindmap: ", e);
      alert("error creating mindmap");
    }
  }

  return (
    <form onSubmit={handleCreateMindmap}>
      <input
        type='text'
        value={newMindmapName}
        onChange={(e) => setNewMindmapname(e.target.value)}
        required
        placeholder='Enter mindmap name'
      />
      <button
        type='submit'
      >
        Create New Mindmap
      </button>
    </form>
  )
}