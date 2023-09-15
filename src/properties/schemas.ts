import { z } from "zod"

export const CreatePropertySchema = z.object({
  address: z.string(),
})
export const UpdatePropertySchema = z.object({
  id: z.number(),
  address: z.string(),
})

export const DeletePropertySchema = z.object({
  id: z.number(),
})
