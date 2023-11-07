import { z } from "zod"

// general schema for all fields related to a "person" entity

export const CreatePersonSchema = {
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional().nullable(),
}

export const UpdatePersonSchema = {
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional().nullable(),
}

export const CreateRealStateOwnerSchema = z.object({
  // template: __fieldName__: z.__zodType__(),
  ...CreatePersonSchema,
})
export const UpdateRealStateOwnerSchema = z.object({
  // template: __fieldName__: z.__zodType__(),
  id: z.number(),
  ...UpdatePersonSchema,
})

export const DeleteRealStateOwnerSchema = z.object({
  id: z.number(),
})
