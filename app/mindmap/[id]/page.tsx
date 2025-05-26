import { createClient } from "@/utils/supabase/server"
import { create } from "domain"
import { redirect } from "next/navigation"
import React, { JSX } from "react"

type Params = {
    params: { id: string}
}

export default async function Mindmap({ params }: Params): Promise<JSX.Element> {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
}