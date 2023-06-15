const { z } = require("zod")

export const registerSchema = z.object({
    name: z.string().trim().min(2, { message: 'Name Should Be At Least 2 Characters' }),
    domain: z.string().trim(),
    role: z.string().trim(),
    email: z.string().trim().email({ message: 'Enter A Valid Email Address' }),
    password: z.string().min(8, { message: "Password Should Have Atleast 8 Characters" })
}).refine(data => data.email.endsWith('@pw.live') || data.email.endsWith('@ineuron.ai') , { message: 'Please Use Ineuron Or PW email', path: ['email'] })