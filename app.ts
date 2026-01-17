import express from 'express'
import {
    getEnergySummary,
    getOptimalWindow,
} from '@/controllers/carbonController.ts'

const app = express()

app.get('/api/get-energy-mix', getEnergySummary)
app.get('/api/get-optimal-window/:hours', getOptimalWindow)

export default app
