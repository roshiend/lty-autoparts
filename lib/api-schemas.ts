import { z } from "zod"

export const contactPayloadSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  company: z.string().max(200).optional().default(""),
  phone: z.string().max(40).optional().default(""),
  message: z.string().min(1).max(8000),
})

export type ContactPayload = z.infer<typeof contactPayloadSchema>

const partSchema = z.object({
  id: z.number(),
  brand: z.string().max(120),
  model: z.string().max(120),
  year: z.string().max(20),
  partName: z.string().min(1).max(500),
  partNumber: z.string().max(120),
  quantity: z.string().max(20),
})

export const quotePayloadSchema = z.object({
  contactInfo: z.object({
    name: z.string().min(1).max(200),
    email: z.string().email().max(320),
    company: z.string().max(200).optional().default(""),
    phone: z.string().min(1).max(40),
    country: z.string().min(1).max(120),
    notes: z.string().max(8000).optional().default(""),
  }),
  parts: z.array(partSchema).min(1).max(50),
  currencyPreference: z.string().max(10).optional().default("GBP"),
})

export type QuotePayload = z.infer<typeof quotePayloadSchema>
