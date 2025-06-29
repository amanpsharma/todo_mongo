import mongoose from 'mongoose'

const TodoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: String,
  completed: Boolean
})

export default mongoose.models.Todo || mongoose.model('Todo', TodoSchema)
