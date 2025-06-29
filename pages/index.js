import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  const [todos, setTodos] = useState([])
  const [text, setText] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return router.push('/login')
    fetch('/api/todos', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(setTodos)
  }, [])

  const addTodo = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ text })
    })
    const todo = await res.json()
    setTodos([...todos, todo])
    setText('')
  }

  const toggleTodo = async (id, completed) => {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/todos', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ id, completed })
    })
    const updated = await res.json()
    setTodos(todos.map(t => t._id === id ? updated : t))
  }

  const deleteTodo = async (id) => {
    const token = localStorage.getItem('token')
    await fetch('/api/todos', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ id })
    })
    setTodos(todos.filter(t => t._id !== id))
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl mb-4">Todo List</h1>
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
