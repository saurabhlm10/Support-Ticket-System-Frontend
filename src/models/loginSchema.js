const { z } = require("zod")

export const loginSchema = z.object({
    email: z.string().trim().email({ message: 'Enter A Valid Email Address' }),
    password: z.string().min(8, { message: "Password Should Have Atleast 8 Characters" })
}).refine(data => data.email.endsWith('@pw.live') || data.email.endsWith('@ineuron.ai') , { message: 'Please Use Ineuron Or PW email', path: ['email'] })