'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createMindmap } from "@/app/actions/createMindmap"
import { useUserStore } from "@/stores/userStore"
import { useMindmapStore } from "@/stores/mindmapStore"
import React, { JSX } from 'react'

export default function CreateNewMindmapButton(): JSX.Element {
  const router = useRouter();
  const userId = useUserStore((state) => state.userId);
  const [mindmapName, setMindmapname] = useState<string>('');
  
  const handleCreateMindmap = async (e: React.FormEvent<HTMLFormElement>) => {
    // prevent default form submission
    e.preventDefault();
    if (!mindmapName || !userId) {
      alert("error: file is CreatenewMindmapButton.tsx");
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
          name: mindmapName,
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
        value={mindmapName}
        onChange={(e) => setMindmapname(e.target.value)}
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