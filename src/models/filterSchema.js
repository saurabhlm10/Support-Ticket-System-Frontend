import { emailSchema } from "./emailSchema";

const { z } = require("zod")

export const filterSchema = z.object({
    studentEmail: z.string().optional(),
    studentPhone: z.string().optional(),
    domain: z.string().optional(),
    status: z.string().optional(),
    type: z.string().optional(),
    handler: z.string().optional(),
    raiser: z.string().optional()
})
    .refine(data => {
        const { studentEmail, studentPhone } = data;
        if (studentEmail) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(studentEmail)
        } else if (studentPhone) {
            return true
        }
        return false
    }, { message: "Enter Valid Email Address", path: ['studentEmail'] }).refine(data => {
        if (data.studentPhone && !(data.studentPhone.length >= 10)) { return false } else {
            return true
        }
    }, { message: "Phone Number Should Have Atleast 10 Characters", path: ['studentPhone'] })
