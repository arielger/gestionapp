import { z } from "zod"

export const AddressSchema = z.object({
  street: z.string().min(1, { message: "Required" }),
  streetNumber: z.number(),
  subpremise: z.string().min(1, { message: "Required" }).optional(),

  state: z.string().min(1, { message: "Required" }),
  city: z.string().min(1, { message: "Required" }),

  postalCode: z.string().min(1, { message: "Required" }).optional(),
})

const emptyAddressToUndefined = (address: Record<string, unknown>) => {
  console.log("preprocess")
  if (Object.values(address).every((value) => value === "" || value === undefined)) {
    console.log("=> return undefined")
    return undefined
  }

  console.log("=> return address")
  return address
}

/**
If all fields are empty (address initial values) we map the address to undefined
*/
export const OptionalAddressSchema = z.preprocess(emptyAddressToUndefined, AddressSchema.optional())
