import express from 'express'
import { getEnergySummary } from '@/controllers/carbonController.ts'

const app = express()

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
app.get('/api/get-energy-mix', getEnergySummary)

export default app
