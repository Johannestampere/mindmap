"use client";

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function TestAuth() {
  const [user, setUser] = useState(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  };

  const signInWithGitHub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="p-12">
      <h1 className="text-2xl font-bold mb-6">OAuth Test Page</h1>

      {user ? (
        <div className="space-y-4">
          <p>Logged in as: {user.email}</p>
          <div className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </div>
          <button
            onClick={signOut}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <button
            onClick={signInWithGoogle}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
          >
            Sign In with Google
          </button>
          <button
            onClick={signInWithGitHub}
            className="bg-gray-800 text-white px-4 py-2 rounded"
          >
            Sign In with GitHub
          </button>
        </div>
      )}
    </div>
  );
}