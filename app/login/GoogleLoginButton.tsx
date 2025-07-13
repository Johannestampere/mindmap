"use client";

import { supabase } from '@/utils/supabase/client';
import React, { JSX } from 'react';

export default function GoogleLoginButton(): JSX.Element {
  const handleGoogleLogin = async (): Promise<void> => {
    const redirectUrl = `https://mindmap-prod-five.vercel.app/auth/callback?next=/dashboard`;

    await supabase.auth.signInWithOAuth({
      provider: 'google',
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
      <button onClick={handleGoogleLogin}>
        Sign in with Google
      </button>
    </div>
  );
}