import { z } from "zod"

export const CreateRealStateOwnerSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  // template: __fieldName__: z.__zodType__(),
})
export const UpdateRealStateOwnerSchema = z.object({
  id: z.number(),
  // template: __fieldName__: z.__zodType__(),
})

export const DeleteRealStateOwnerSchema = z.object({
  id: z.number(),
})
