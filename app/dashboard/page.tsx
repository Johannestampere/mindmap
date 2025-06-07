import React, { JSX } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import LogOutButton from "../components/LogOutButton";
import Link from "next/link";
import DashboardClient from "./DashboardClient";
import CreateNewMindmapButton from "../components/CreateNewMindmapButton";

export default async function Dashboard(): Promise<JSX.Element> {
  const supabase = await createClient();

  // get user data from supabase once logged in
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/login');
  }

  // req: send userid to backend, get back username
  const resUsername = await fetch("http://hfcs.csclub.uwaterloo.ca:8000/get_username", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: data.user.id,
    }),
  });

  const { username }: { username: string } = await resUsername.json();

  if (!resUsername.ok) {
    redirect("/error");
  }

  // req: send user id to backend, get back all mindmap id's and names of that user
  const resMindmaps = await fetch("http://hfcs.csclub.uwaterloo.ca:8000/get_mindmaps", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: data.user.id,
    }),
  });

  // res has to be an array of this user's mindmaps id's and names
  const mindmaps: { mindmapId: string; mindmapName: string }[] = await resMindmaps.json();

  return (
    <div>
      {/* sets up the client-side user state using Zustand so other components can access userId, email, and username */}
      <DashboardClient userId={data.user.id} email={data.user.email!} username={username} />

      <h1 className="text-6xl">{data.user.email}</h1>

      <CreateNewMindmapButton />
      
      <ul>
        {mindmaps.map((mindmap: { mindmapId: string; mindmapName: string }) => (
          <li key={mindmap.mindmapId}>
            <Link href={`/mindmap/${mindmap.mindmapId}`}>
              {mindmap.mindmapName}
            </Link>
          </li>
        ))}
      </ul>

      <LogOutButton />
    </div>
  )
}
