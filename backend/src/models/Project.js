import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({
  id: { type: String, unique: true, sparse: true, index: true },
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true, index: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },
  overview: { type: String, required: true },
  features: { type: [String], default: [] },
  technology: { type: [String], default: [] },
  deliverables: { type: [String], default: [] },
  image: { type: String, default: '' },
  imageAlt: { type: String, default: '' },
}, { timestamps: true })

export const Project = mongoose.model('Project', projectSchema, 'ProjectPool')