import { type CarbonIntensityResponse } from '@/interfaces/carbon.interface.ts'
import axios from 'axios'

const getGenerationData = async (
    from: string,
    to: string
): Promise<CarbonIntensityResponse> => {
    try {
        const url = `https://api.carbonintensity.org.uk/generation/${from}/${to}`

        const response = await axios.get<CarbonIntensityResponse>(url)
        return response.data
    } catch (error) {
        throw new Error(error as string)
    }
}

export { getGenerationData }
