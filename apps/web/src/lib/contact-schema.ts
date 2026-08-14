import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  email: z.string().trim().email("Enter a valid email"),
  subject: z.string().trim().optional(),
  message: z.string().trim().min(10, "Please enter a message"),
});

export type ContactInput = z.infer<typeof contactSchema>;
