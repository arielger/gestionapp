import { z } from "zod"

export const CreateTenantSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  // template: __fieldName__: z.__zodType__(),
})
export const UpdateTenantSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  // template: __fieldName__: z.__zodType__(),
})

export const DeleteTenantSchema = z.object({
  id: z.number(),
})
