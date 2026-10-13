import { Router } from 'express'
import mongoose from 'mongoose'
import { Project } from '../models/Project.js'
import { starterProjects } from '../data/projects.js'

const router = Router()

router.get('/', async (request, response, next) => {
  try {
    const { category, difficulty, q } = request.query
    const filters = {}
    if (category) filters.category = category
    if (difficulty) filters.difficulty = difficulty
    if (q) {
      const escapedQuery = String(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      filters.$or = ['title', 'description', 'technology'].map((field) => ({ [field]: { $regex: escapedQuery, $options: 'i' } }))
    }

    if (mongoose.connection.readyState === 1) {
      const projects = await Project.find(filters).sort({ createdAt: -1 }).lean()
      return response.json(projects)
    }

    const searchTerm = String(q || '').toLowerCase()
    const projects = starterProjects.filter((project) => {
      const matchesCategory = !category || project.category === category
      const matchesDifficulty = !difficulty || project.difficulty === difficulty
      const matchesSearch = !searchTerm || `${project.title} ${project.description} ${project.technology.join(' ')}`.toLowerCase().includes(searchTerm)
      return matchesCategory && matchesDifficulty && matchesSearch
    })
    return response.json(projects)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (request, response, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const project = mongoose.isValidObjectId(request.params.id) ? await Project.findById(request.params.id).lean() : await Project.findOne({ id: request.params.id }).lean()
      if (project) return response.json(project)
    }
    const project = starterProjects.find((item) => item.id === request.params.id)
    if (!project) return response.status(404).json({ message: 'Project not found' })
    return response.json(project)
  } catch (error) {
    next(error)
  }
})

export default router