"use client";

import { supabase } from '@/utils/supabase/client';
import React from 'react';
import { JSX } from 'react';

export default function GithubLoginButton(): JSX.Element {
  const handleGithubLogin = async () => {
    const redirectUrl = `https://mindmap-prod-five.vercel.app/auth/callback?next=/dashboard`;

    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
  };

  return (
    <div>
      <button onClick={handleGithubLogin}>
        Sign in with Github
      </button>
    </div>
  );
}
