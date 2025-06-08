import { loginEmail } from './loginEmail'
import { signUp } from '../signup/signUp'
import GoogleLoginButton from './GoogleLoginButton'
import GithubLoginButton from './GithubLoginButton'
import Link from 'next/link'
import { JSX } from 'react'

export default function LoginPage(): JSX.Element {
  return (
    <form>
      
      <label htmlFor="identifier">email or username</label>
      <input id="identifier" name="identifier" type="text" required />

      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />

      <button formAction={loginEmail}>Log in</button>

      <Link href="/signup">Sign Up</Link>

      <GoogleLoginButton />
      <GithubLoginButton />

    </form>
  )
}