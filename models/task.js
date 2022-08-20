const mongoose = require('mongoose')

const Schema = mongoose.Schema

const TaskSchema = new Schema({
  header: { type: String, required: true, maxLength: 50 },
  description: { type: String, maxLength: 500 },
  createdAt: { type: Date, default: Date.now },
  isCompleted: { type: Boolean, default: false },
})

//Export model
module.exports = mongoose.model('Task', TaskSchema)
