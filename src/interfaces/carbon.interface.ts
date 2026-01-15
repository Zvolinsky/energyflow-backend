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

// Type for a response sent to frontend
interface DailyEnergySummary {
    date: string
    averageCleanEnergy: number
    averageMix: GenerationMix[]
}

export type {
    CarbonResponseDataItem,
    CarbonIntensityResponse,
    DailyEnergySummary,
    GenerationMix,
}
