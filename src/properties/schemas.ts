import { z } from "zod"

export const CreatePropertySchema = z.object({
  address: z.string(),
  owners: z.array(z.number()),
})
export const UpdatePropertySchema = z.object({
  id: z.number(),
  address: z.string(),
  owners: z.array(z.number()),
})

export const DeletePropertySchema = z.object({
  id: z.number(),
})
