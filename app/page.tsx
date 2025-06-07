import Link from "next/link";
import React from "react";
import LoginButton from "./components/LoginButton";

export default function LandingPage() {
  return (
    <div className="items-center bg-gray-100 justify-center">
      <div>
          <h1 className="text-2xl">landing page</h1>
      </div>
 
      <LoginButton />
    </div>
  )
}