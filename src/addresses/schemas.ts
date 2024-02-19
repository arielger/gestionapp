import { z, zodNonEmptyStringValidation } from "src/core/zod"

export const AddressSchema = z.object({
  street: zodNonEmptyStringValidation,
  streetNumber: z.number(),
  subpremise: zodNonEmptyStringValidation.optional(),

  state: zodNonEmptyStringValidation,
  city: zodNonEmptyStringValidation,

  postalCode: zodNonEmptyStringValidation.optional(),
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
