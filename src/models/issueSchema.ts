import { z } from "zod";
import { Issues } from "../constant";

const issueSchema = z.object({
  studentName: z.string().trim().min(1, { message: "Enter Student Name" }),
  studentEmail: z.string().email({ message: "Enter Valid Email" }).trim(),
  studentPhone: z
    .string()
    .min(10, { message: "Phone Number should have 10 characters" })
    .max(10, {
      message: "Phone Number should have 10 characters",
    }),

  issueType: z.enum(["Assignment", "Batch-Change", "No-Access", "Other"], {
    description: "Select An Issue From the list",
  }),
  // handlers: z.object().array().optional(),
  attachments: z.array(z.string()).optional(),
  description: z.string().trim().optional(),
});

export default issueSchema;
