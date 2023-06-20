const { z } = require("zod")

export const emailSchema = z.object({
    email: z.string().email()
})