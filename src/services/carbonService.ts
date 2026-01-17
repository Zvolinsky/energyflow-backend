import { format, addDays, addHours } from 'date-fns'
import { getGenerationData } from '@/clients/carbonClient.ts'
import {
    type CarbonResponseDataItem,
    type DailyEnergySummary,
    type GenerationMix,
    type OptimalWindowResponse,
} from '@/interfaces/carbon.interface.ts'
import { isCleanEnergy, roundToTwo } from '@/utils/energyUtils.ts'

const getThreeDaySummary = async (): Promise<DailyEnergySummary[]> => {
    // Dates strings - from today to day after tomorrow
    const today = addHours(new Date(), 2)

    // Formatting to ISO strings for CET timezone
    const startOfDayString = `${format(today, 'yyyy-MM-dd')}T00:00:00.000Z`
    const endOfDayString = `${format(addDays(today, 2), 'yyyy-MM-dd')}T23:59:59.999Z`

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

const getOptimalChargingWindow = async (
    hours: number
): Promise<OptimalWindowResponse> => {
    // Dates strings - forecast for next 48 hours
    const now = new Date()

    // Dodajemy 1 godzinę do obecnego czasu, aby skompensować przesunięcie UTC
    const startTime = addHours(now, 1)
    // End time to 48 godzin od skorygowanego czasu startu
    const endTime = addHours(startTime, 48)

    const startTimeString = startTime.toISOString()
    const endTimeString = endTime.toISOString()

    const rawData = await getGenerationData(startTimeString, endTimeString)
    const intervals = rawData.data

    // Changing hours to intervals (1 hour -> 2 intervals)
    const windowSize = hours * 2

    let optimalStartIndex = 0
    let maxCleanEnergy = -1

    // WINDOW SLIDING: Moving through intervals array
    // Finding the window with the highest average clean energy

    for (let i = 0; i <= intervals.length - windowSize; i++) {
        let currentWindowSum = 0

        //Summing up clean energy in the current window
        for (let j = i; j < i + windowSize; j++) {
            const interval = intervals[j]
            if (!interval) continue
            const intervalCleanEnergy = interval.generationmix
                .filter((mix) => isCleanEnergy(mix.fuel))
                .reduce((sum, mix) => sum + mix.perc, 0)
            currentWindowSum += intervalCleanEnergy
        }

        // If the current window has more clean energy, update optimal window
        if (currentWindowSum > maxCleanEnergy) {
            maxCleanEnergy = currentWindowSum
            optimalStartIndex = i
        }
    }

    // Getting results
    const optimalWindow = intervals.slice(
        optimalStartIndex,
        optimalStartIndex + windowSize
    )

    const averageCleanEnergy = maxCleanEnergy / windowSize
    return {
        start: optimalWindow[0]?.from as string,
        end: optimalWindow[optimalWindow.length - 1]?.to as string,
        averageCleanEnergy: roundToTwo(averageCleanEnergy),
    }
}

export { getOptimalChargingWindow, getThreeDaySummary }
