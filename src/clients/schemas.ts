import { z, zodEmptyValueToUndefined, zodNonEmptyStringValidation } from "src/core/zod"

import { OptionalAddressSchema } from "src/addresses/schemas"

export const phoneNumberRegExp = new RegExp("^[\\d\\s\\-.()]+$")

export const CreateClientSchema = z.object({
  firstName: zodNonEmptyStringValidation,
  lastName: zodNonEmptyStringValidation,
  email: zodEmptyValueToUndefined(z.string().email("Email inválido").optional()),
  // check that id number has 7 or 8 digits (argentinian DNI validation)
  identityDocNumber: zodEmptyValueToUndefined(
    z
      .number()
      .gte(1000000, "El DNI debe tener 7 u 8 dígitos")
      .lte(99999999, "El DNI debe tener 7 u 8 dígitos")
  ),
  address: OptionalAddressSchema,
  phoneNumber: zodEmptyValueToUndefined(
    z
      .string()
      .regex(phoneNumberRegExp, "El teléfono solo puede contener dígitos, puntos y guiones.")
      .optional()
  ),
})

export const UpdateClientSchema = CreateClientSchema.extend({
  id: z.number(),
  // used to delete old address if all fields were deleted
  addressId: z.number().optional().nullable(),
})

export const DeleteClientSchema = z.object({
  id: z.number(),
})
