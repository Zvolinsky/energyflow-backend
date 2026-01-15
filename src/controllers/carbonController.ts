import { type Request, type Response } from 'express'
import { getThreeDaySummary } from '@/services/carbonService.ts'

const getEnergySummary = async (req: Request, res: Response) => {
    try {
        const summary = await getThreeDaySummary()
        res.json(summary)
    } catch (err) {
        res.status(500).json({
            error: err,
        })
    }
}

export { getEnergySummary }
