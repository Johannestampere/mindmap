'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createMindmap } from "@/app/actions/createMindmap"
import { useUserStore } from "@/stores/userStore"
import { useMindmapStore } from "@/stores/mindmapStore"

export default function CreateMindmapForm() {
    const [name, setName] = useState('')
    const router = useRouter()
    const userId = useUserStore((state) => state.userId)
    const setMindmap = useMindmapStore((state) => state.setMindmap)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
    
        if (!userId) {
          router.push('/login')
          return
        }
    
        const mindmapId = await createMindmap({ name, userId })
    
        if (!mindmapId) {
          alert('failed to create mindmap')
          return
        }
    
        setMindmap({ id: mindmapId, name })
    
        router.push(`/mindmap/${mindmapId}`)
      }