import { z, zodNonEmptyStringValidation } from "src/core/zod"

import { OptionalAddressSchema } from "src/addresses/schemas"

export const CreateClientSchema = z.object({
  firstName: zodNonEmptyStringValidation,
  lastName: zodNonEmptyStringValidation,
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
