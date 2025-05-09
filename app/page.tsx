import React, { JSX } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export default function LandingPage(): JSX.Element {
  
  return (
    <div>
      <h1>Sign in to your account</h1>
      <form>

        <div>
          <input placeholder="email"></input>
        </div>

        <div>
          <input placeholder="password"></input>
        </div>

        <button>Forgot password?</button>

        <button>Sign in</button>

        <div>Or sign in with</div>

        <div>Google</div>
        <div>Github</div>
      </form>
    </div>
  );
}