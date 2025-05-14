"use client";

import { createClient } from '@/utils/supabase/client';
import React from 'react';

export default function GoogleLoginButton() {
  const handleGoogleLogin = async () => {
    const supabase = createClient();
    const redirectUrl = `${window.location.origin}/auth/callback?next=/dashboard`;

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
