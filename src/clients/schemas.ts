import { z } from "zod"

import { OptionalAddressSchema } from "src/addresses/schemas"

export const CreateClientSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional().nullable(),
  address: OptionalAddressSchema,
})

export const UpdateClientSchema = CreateClientSchema.extend({
  id: z.number(),
  // used to delete old address if all fields were deleted
  addressId: z.number().optional().nullable(),
})

export const DeleteClientSchema = z.object({
  id: z.number(),
})
