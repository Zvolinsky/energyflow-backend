import { type Request, type Response } from 'express'
import {
    getThreeDaySummary,
    getOptimalChargingWindow,
} from '@/services/carbonService.ts'
import { chargingHoursSchema } from '@/validation/validationSchema.ts'

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
        const validation = chargingHoursSchema.safeParse(
            parseInt(req.params.hours as string)
        )

        if (!validation.success) {
            return res.status(400).json({
                error: validation.error._zod.def[0]?.message,
            })
        }

        const optimalWindow = await getOptimalChargingWindow(validation.data)

        res.json(optimalWindow)
    } catch (err) {
        res.status(500).json({
            error: err,
        })
    }
}

export { getEnergySummary, getOptimalWindow }
