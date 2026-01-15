import { format, addDays, startOfDay, endOfDay } from 'date-fns'
import { getGenerationData } from '@/clients/carbonClient.ts'
import {
    type CarbonResponseDataItem,
    type DailyEnergySummary,
    type GenerationMix,
} from '@/interfaces/carbon.interface.ts'
import { isCleanEnergy, roundToTwo } from '@/utils/energyUtils.ts'

const getThreeDaySummary = async (): Promise<DailyEnergySummary[]> => {
    // Dates strings - from today to day after tomorrow
    const today = new Date()
    const startOfDayString = startOfDay(today).toISOString()
    const endOfDayString = endOfDay(addDays(today, 2)).toISOString()

    // Retrieving raw data from Carbon Intensity API
    const rawData = await getGenerationData(startOfDayString, endOfDayString)

    // Grouping intervals by data (YYYY-MM-DD)
    const groupedData: Record<string, CarbonResponseDataItem[]> = {}

    rawData.data.forEach((interval) => {
        const dateKey = format(new Date(interval.from), 'yyyy-MM-dd')
        if (!groupedData[dateKey]) {
            groupedData[dateKey] = []
        }
        groupedData[dateKey].push(interval)
    })

    // Calculating daily averages
    return Object.entries(groupedData).map(([date, intervals]) => {
        const totalIntervals = intervals.length
        const fuelSums: Record<string, number> = {}

        // Summing fuel percentages for the day
        intervals.forEach((interval) => {
            interval.generationmix.forEach((mix: GenerationMix) => {
                fuelSums[mix.fuel] = (fuelSums[mix.fuel] || 0) + mix.perc
            })
        })

        // Transforming sums to averages
        const averageMix: GenerationMix[] = Object.entries(fuelSums).map(
            ([fuel, sum]) => ({
                fuel,
                perc: roundToTwo(sum / totalIntervals),
            })
        )

        // Calculating total clean energy percentage
        const averageCleanEnergy = averageMix
            .filter((item) => isCleanEnergy(item.fuel))
            .reduce((sum, item) => sum + item.perc, 0)

        return {
            date,
            averageCleanEnergy: Number(averageCleanEnergy.toFixed(2)),
            averageMix,
        }
    })
}

export { getThreeDaySummary }
