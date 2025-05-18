import React, { JSX } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import LogOutButton from "../components/LogOutButton";

export default async function Dashboard() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  const userId = data.user.id

  // req: send user id to backend, get back all mindmap id's of that user
  /*const res = await fetch("http://hfcs.csclub.uwaterloo.ca:8000/get_mindmaps", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
    }),
  })

  const mindmaps = await res.json()*/

  /*
        <ul>
          {mindmaps.map((mindmap: { id: string }) => (
            <li key={mindmap.id}>{mindmap.id}</li>
          ))}
      </ul>
    */

  return (
    <div>
      <h1 className="text-6xl">{data.user.email}</h1>
      
      <LogOutButton />
    </div>
  )
}