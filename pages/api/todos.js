import dbConnect from '../../lib/db'
import Todo from '../../models/Todo'
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'secret'

async function auth(req) {
  const { authorization } = req.headers
  if (!authorization) return null
  const [, token] = authorization.split(' ')
  try {
    return jwt.verify(token, SECRET)
  } catch {
    return null
  }
}

export default async function handler(req, res) {
  await dbConnect()
  const user = await auth(req)
  if (!user) return res.status(401).json({ message: 'Unauthorized' })

  if (req.method === 'GET') {
    const todos = await Todo.find({ userId: user.id })
    return res.status(200).json(todos)
  }

  if (req.method === 'POST') {
    const todo = await Todo.create({ userId: user.id, text: req.body.text, completed: false })
    return res.status(201).json(todo)
  }

  if (req.method === 'PUT') {
    const { id, completed } = req.body
    const todo = await Todo.findByIdAndUpdate(id, { completed }, { new: true })
    return res.status(200).json(todo)
  }

  if (req.method === 'DELETE') {
    const { id } = req.body
    await Todo.findByIdAndDelete(id)
    return res.status(204).end()
  }

  res.status(405).end()
}
