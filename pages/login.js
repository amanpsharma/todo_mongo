import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (res.ok) {
      const { token } = await res.json()
      localStorage.setItem('token', token)
      router.push('/')
    }
  }

  return (
    <div className="max-w-sm mx-auto p-4">
      <h1 className="text-2xl mb-4">Login</h1>
      <form onSubmit={submit} className="flex flex-col gap-2">
        <input className="border p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="border p-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="bg-blue-500 text-white p-2">Login</button>
      </form>
      <p className="mt-2">No account? <a href="/register" className="text-blue-500">Register</a></p>
    </div>
  )
}
