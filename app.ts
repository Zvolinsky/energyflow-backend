import express from 'express'
import cors from 'cors'
import {
    getEnergySummary,
    getOptimalWindow,
} from '@/controllers/carbonController.ts'

const app = express()

let corsOptions = {
    origin: ['http://localhost:5173'],
}

app.use(cors(corsOptions))

app.get('/api/get-energy-mix', getEnergySummary)
app.get('/api/get-optimal-window/:hours', getOptimalWindow)

export default app
