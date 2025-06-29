import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession, signOut } from 'next-auth/react'

export default function Home() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [todos, setTodos] = useState([])
  const [text, setText] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session) return router.push('/login')
    fetch('/api/todos').then(r => r.json()).then(setTodos)
  }, [session, status])

  const addTodo = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })
    const todo = await res.json()
    setTodos([...todos, todo])
    setText('')
  }

  const toggleTodo = async (id, completed) => {
    const res = await fetch('/api/todos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, completed })
    })
    const updated = await res.json()
    setTodos(todos.map(t => t._id === id ? updated : t))
  }

  const deleteTodo = async (id) => {
    await fetch('/api/todos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    setTodos(todos.filter(t => t._id !== id))
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Todo List</h1>
        <button className="text-sm text-blue-500" onClick={() => signOut()}>Sign out</button>
      </div>
      <form onSubmit={addTodo} className="flex mb-4">
        <input className="flex-1 border p-2" value={text} onChange={(e) => setText(e.target.value)} />
        <button className="ml-2 px-4 py-2 bg-blue-500 text-white">Add</button>
      </form>
      <ul>
        {todos.map(todo => (
          <li key={todo._id} className="flex items-center mb-2">
            <input type="checkbox" className="mr-2" checked={todo.completed} onChange={() => toggleTodo(todo._id, !todo.completed)} />
            <span className={todo.completed ? 'line-through flex-1' : 'flex-1'}>{todo.text}</span>
            <button className="ml-2 text-red-500" onClick={() => deleteTodo(todo._id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
