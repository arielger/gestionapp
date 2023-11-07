import { z } from "zod"

import { CreatePersonSchema, UpdatePersonSchema } from "src/real-state-owners/schemas"

export const CreateTenantSchema = z.object({
  // template: __fieldName__: z.__zodType__(),
  ...CreatePersonSchema,
})
export const UpdateTenantSchema = z.object({
  // template: __fieldName__: z.__zodType__(),
  id: z.number(),
  ...UpdatePersonSchema,
})

export const DeleteTenantSchema = z.object({
  id: z.number(),
})
