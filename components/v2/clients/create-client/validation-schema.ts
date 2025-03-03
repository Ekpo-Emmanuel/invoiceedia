import * as z from "zod"

const baseSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    street: z.string().optional(),
    city: z.string().optional(),
    zip: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    notes: z.string().optional(),
})

export const individualClientSchema = baseSchema

export const businessClientSchema = baseSchema.extend({
    companyName: z.string().min(1, "Company name is required"),
})

export type IndividualFormData = z.infer<typeof individualClientSchema>
export type BusinessFormData = z.infer<typeof businessClientSchema> 