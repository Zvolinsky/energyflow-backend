export const CLEAN_ENERGY_FUELS = [
    'biomass',
    'nuclear',
    'hydro',
    'wind',
    'solar',
]

export const isCleanEnergy = (fuel: string): boolean => {
    return CLEAN_ENERGY_FUELS.includes(fuel)
}

export const roundToTwo = (num: number): number => {
    return Math.round((num + Number.EPSILON) * 100) / 100
}
