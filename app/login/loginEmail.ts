// only runs this code on the server, not the client side
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

// the form is in a separate file, and we gotta use specific tags on the html elements for supabase to work
export async function loginEmail(formData: FormData) {
    // creates a supabase client on the server
    const supabase = await createClient();
  
    // gets the email and password from the form data
    const identifier = formData.get('identifier') as string;
    const password =  formData.get('password') as string;

    let email = identifier;
  
    // if identifier is an email, use signInWithPassword
    // else, we fetch the email from the backend using the username and then log in with that email
    if (!identifier.includes('@')) {
      const res = await fetch('http://hfcs.csclub.uwaterloo.ca:8000/get_email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: identifier }),
      })

      if (!res.ok) {
        redirect('/error');
      }

      const data = await res.json();
      email = data.email;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data?.user) {
      redirect('/error');
    }
  
    // tells nextjs to refresh the cache for the layout page
    revalidatePath('/', 'layout');
    // if nothing went wrong, redirects to the dashboard page
    redirect('/dashboard');
}