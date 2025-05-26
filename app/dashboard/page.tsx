import React, { JSX } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import LogOutButton from "../components/LogOutButton";
import Link from "next/link";
import DashboardClient from "./DashboardClient";

export default async function Dashboard(): Promise<JSX.Element> {
  const supabase = await createClient();

  // get user data from supabase once logged in
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/login')
  }

  const userId = data.user.id

  // req: send userid to backend, get back username
  const resUsername = await fetch("http://hfcs.csclub.uwaterloo.ca:8000/get_username", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: userId,
    }),
  })

  const { username }: { username: string } = await resUsername.json()

  // req: send user id to backend, get back all mindmap id's and names of that user
  const resMindmaps = await fetch("http://hfcs.csclub.uwaterloo.ca:8000/get_mindmaps", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: userId,
    }),
  })

  // res has to be a collection of this user's mindmaps id's and names
  const mindmaps: { id: string; name: string }[] = await resMindmaps.json()

  return (
    <div>
      <DashboardClient userId={userId} email={data.user.email!} username={username} />
      <h1 className="text-6xl">{data.user.email}</h1>
      <ul>
        {mindmaps.map((mindmap: { id: string; name: string }) => (
          <li key={mindmap.id}>
            <Link href={`/mindmap/${mindmap.id}`}>
              {mindmap.name}
            </Link>
          </li>
        ))}
      </ul>

      <LogOutButton />
    </div>
  )
}
