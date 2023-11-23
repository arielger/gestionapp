import { z } from "zod"

export const PropertyBaseSchema = z.object({
  address: z.string(),
})

export const CreatePropertyFormSchema = PropertyBaseSchema.extend({
  owners: z.array(
    z.string().refine(
      (v) => {
        let n = Number(v)
        return !isNaN(n) && v?.length > 0
      },
      { message: "Ingrese un número valido" }
    )
  ),
})

export const CreatePropertyMutationSchema = PropertyBaseSchema.extend({
  owners: z.array(z.number()),
})

export const UpdatePropertyMutationSchema = CreatePropertyMutationSchema.extend({
  id: z.number(),
})

export const DeletePropertySchema = z.object({
  id: z.number(),
})
