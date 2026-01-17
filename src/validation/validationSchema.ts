import { z } from 'zod'

const chargingHoursSchema = z
    .number()
    .min(1, { message: 'zam malooo' })
    .max(6, { message: 'z aduzoooo' })

export { chargingHoursSchema }
