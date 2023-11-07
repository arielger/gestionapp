import { z } from "zod"

export const CreateTenantSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional().nullable(),
  // template: __fieldName__: z.__zodType__(),
})
export const UpdateTenantSchema = z.object({
  id: z.number(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional().nullable(),
  // template: __fieldName__: z.__zodType__(),
})

export const DeleteTenantSchema = z.object({
  id: z.number(),
})
