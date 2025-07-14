
import React from "react";
import LoginButton from "./components/LoginButton";

export default function LandingPage() {
  return (
    <div className="items-center bg-gray-100 justify-center">
      <div>
          <h1 className="text-2xl">landing page</h1>
      </div>

      <h1>5x your team's ideation speed—try [NAME] today!</h1>

      <LoginButton />
    </div>
  )
}
