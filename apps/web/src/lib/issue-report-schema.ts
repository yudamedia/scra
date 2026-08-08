import { z } from "zod";

export const issueReportCategories = [
  "roads",
  "security",
  "street_lighting",
  "illegal_development",
  "environmental",
  "other",
] as const;

export const issueReportSchema = z.object({
  reporterName: z.string().trim().min(2, "Please enter your name"),
  reporterPhone: z.string().trim().optional(),
  reporterEmail: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
  category: z.enum(issueReportCategories),
  description: z.string().trim().min(20, "Please describe the issue in a bit more detail"),
  addressText: z.string().trim().optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
});

export type IssueReportInput = z.infer<typeof issueReportSchema>;
