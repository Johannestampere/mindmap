import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { signUp } from "./signUp";

export default function signUpPage() {
    return (
        <div>
        <h1 className="text-2xl">Sign Up</h1>
        <form action={signUp}>
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Sign Up</button>
        </form>
        </div>
    );
}

