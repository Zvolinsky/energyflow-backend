import { type Request, type Response } from 'express'
import {
    getThreeDaySummary,
    getOptimalChargingWindow,
} from '@/services/carbonService.ts'

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

const getOptimalWindow = async (req: Request, res: Response) => {
    try {
        const optimalWindow = await getOptimalChargingWindow(
            parseInt(req.params.hours as string)
        )
        res.json(optimalWindow)
    } catch (err) {
        res.status(500).json({
            error: err,
        })
    }
}

export { getEnergySummary, getOptimalWindow }
