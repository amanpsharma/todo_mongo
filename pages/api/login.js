import dbConnect from '../../lib/db'
import User from '../../models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'secret'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  await dbConnect()
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' })
  const token = jwt.sign({ id: user._id }, SECRET)
  res.status(200).json({ token })
}
