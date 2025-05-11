import { loginEmail } from './loginEmail'
import { signup } from './signup'
import GoogleLoginButton from './GoogleLoginButton'

export default function LoginPage() {
  return (
    <form>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={loginEmail}>Log in</button>
      <button formAction={signup}>Sign up</button>
      <GoogleLoginButton />
    </form>
  )
}