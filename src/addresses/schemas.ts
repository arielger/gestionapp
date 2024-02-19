import { z } from "src/core/zod"

export const AddressSchema = z.object({
  street: z.string().min(1),
  streetNumber: z.number(),
  subpremise: z.string().min(1).optional(),

  state: z.string().min(1),
  city: z.string().min(1),

  postalCode: z.string().min(1).optional(),
})

const emptyAddressToUndefined = (address: Record<string, unknown>) => {
  if (Object.values(address).every((value) => value === "" || value === undefined)) {
    return undefined
  }

  return address
}

/**
If all fields are empty (address initial values) we map the address to undefined
*/
export const OptionalAddressSchema = z.preprocess(emptyAddressToUndefined, AddressSchema.optional())
