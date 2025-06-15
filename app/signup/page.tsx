import React from "react";
import { signUp } from "./signUp";
import { JSX } from "react";

export default function signUpPage(): JSX.Element {
    return (
        <div>
        <h1 className="text-2xl">Sign Up</h1>
        <form action={signUp}>
            <input type="text" name="username" placeholder="Username" required />
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Sign Up</button>
        </form>
        </div>
    );
}