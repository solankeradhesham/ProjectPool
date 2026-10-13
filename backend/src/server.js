import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import mongoose from 'mongoose'
import morgan from 'morgan'
import { Project } from './models/Project.js'
import projectsRouter from './routes/projects.js'
import { starterProjects } from './data/projects.js'

const app = express()
const port = process.env.PORT || 5000
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ProjectPool'
const mongoDatabase = process.env.MONGODB_DB || 'ProjectPool'

app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json({ limit: '1mb' }))
app.use(morgan('dev'))
app.get('/api/health', (_request, response) => response.json({
  status: 'ok',
  database: mongoose.connection.readyState === 1 ? 'connected' : 'seed-data',
  databaseName: mongoose.connection.readyState === 1 ? mongoose.connection.name : mongoDatabase,
  collectionName: Project.collection.collectionName,
}))
app.use('/api/projects', projectsRouter)
app.use((error, _request, response, _next) => {
  console.error(error)
  response.status(500).json({ message: 'Something went wrong while loading projects.' })
})

app.listen(port, () => console.log(`ProjectPool API listening on http://localhost:${port}`))

mongoose.connect(mongoUri, { dbName: mongoDatabase })
  .then(async () => {
    if (await Project.countDocuments() === 0) await Project.insertMany(starterProjects)
    console.log(`Connected to MongoDB database ${mongoDatabase}, collection ${Project.collection.collectionName}`)
  })
  .catch((error) => console.warn(`MongoDB unavailable; serving starter projects. ${error.message}`))