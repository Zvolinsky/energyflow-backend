interface GenerationMix {
    fuel: string
    perc: number
}

interface CarbonResponseDataItem {
    from: string
    to: string
    generationmix: GenerationMix[]
}

interface CarbonIntensityResponse {
    data: CarbonResponseDataItem[]
}

// Types for a response sent to frontend
interface DailyEnergySummary {
    date: string
    averageCleanEnergy: number
    averageMix: GenerationMix[]
}

interface OptimalWindowResponse {
    start: string
    end: string
    averageCleanEnergy: number
}

export type {
    CarbonResponseDataItem,
    CarbonIntensityResponse,
    DailyEnergySummary,
    GenerationMix,
    OptimalWindowResponse,
}
