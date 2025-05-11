import { loginEmail } from './loginEmail'
import { signUp } from '../signup/signUp'
import GoogleLoginButton from './GoogleLoginButton'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <form>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={loginEmail}>Log in</button>
      <Link href="/signup">Sign Up</Link>
      <GoogleLoginButton />
    </form>
  )
}