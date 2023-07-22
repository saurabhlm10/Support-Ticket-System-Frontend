import { z } from "zod";
import { Issues } from "../constant";

const issueSchema = z.object({
    studentName: z.string().trim().min(1, { message: 'Enter Student Name' }),
    studentEmail: z.string().email({ message: 'Enter Valid Email' }).trim(),
    studentPhone: z.string().min(10, { message: 'Phone Number should have 10 characters' }).max(10, {
        message: 'Phone Number should have 10 characters'
    }).transform(value => { Number(value) }),
    issueType: z.enum(Issues, { message: 'Select An Issue From the list' }),
    // handlers: z.string().array({ message: 'Select Atleast One Handler' }).transform(value => { console.log(value); }),
    handlers: z.string().transform(value => { console.log(value); }),
    attachments: z.optional(),
    description: z.string().trim().optional()
})

export default issueSchema;