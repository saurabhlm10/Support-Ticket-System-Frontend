import { z } from "zod";
import { Issues } from "../constant";

const issueSchema = z.object({
    studentName: z.string().trim().min(1, { message: 'Enter Student Name' }),
    studentEmail: z.string().email({ message: 'Enter Valid Email' }).trim(),
    studentPhone: z.string().min(10, { message: 'Phone Number should have 10 characters' }).max(10, {
        message: 'Phone Number should have 10 characters'
    }),

    issueType: z.enum(Issues, { message: 'Select An Issue From the list' }),
    // handlers: z.object().array().optional(),
    attachments: z.optional(),
    description: z.string().trim().optional()
})

export default issueSchema;