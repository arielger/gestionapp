import { z } from "zod"

export const CreateClientSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional().nullable(),
})

export const UpdateClientSchema = CreateClientSchema.extend({
  id: z.number(),
})

export const DeleteClientSchema = z.object({
  id: z.number(),
})
