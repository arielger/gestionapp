import { z } from "zod"

export const PropertyBaseSchema = z.object({
  address: z.string(),
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
