import dbConnect from '../../lib/db'
import User from '../../models/User'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  await dbConnect()
  const { email, password } = req.body
  const hashed = await bcrypt.hash(password, 10)
  try {
    const user = await User.create({ email, password: hashed })
    res.status(201).json({ id: user._id, email: user.email })
  } catch (e) {
    res.status(400).json({ message: 'User creation failed' })
  }
}
