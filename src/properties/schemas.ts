import { z } from "zod"

export const PropertyBaseSchema = z.object({
  address: z.object({
    street: z.string(),
    streetNumber: z.number(),
    subpremise: z.string().optional(),

    state: z.string(),
    city: z.string(),

    postalCode: z.string().optional(),
  }),
})

export const CreatePropertyFormSchema = PropertyBaseSchema.extend({
  owners: z
    .array(
      z.string().refine(
        (v) => {
          const n = Number(v)
          return !isNaN(n) && v?.length > 0
        },
        { message: "Ingrese un número valido" }
      )
    )
    .min(1),
})

export const CreatePropertyMutationSchema = PropertyBaseSchema.extend({
  owners: z.array(z.number()).min(1),
})

export const UpdatePropertyMutationSchema = CreatePropertyMutationSchema.extend({
  id: z.number(),
})

export const DeletePropertySchema = z.object({
  id: z.number(),
})
