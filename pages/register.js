import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Register() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (res.ok) {
      router.push('/login')
    }
  }

  return (
    <div className="max-w-sm mx-auto p-4">
      <h1 className="text-2xl mb-4">Register</h1>
      <form onSubmit={submit} className="flex flex-col gap-2">
        <input className="border p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="border p-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="bg-blue-500 text-white p-2">Register</button>
      </form>
      <p className="mt-2">Already have an account? <a href="/login" className="text-blue-500">Login</a></p>
    </div>
  )
}
