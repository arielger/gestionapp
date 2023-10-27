import { z } from "zod"

// We need to use z.coerce because mantine Select only allows
// string as MultiSelect value

export const CreateContractSchema = z.object({
  propertyId: z.number(),
  owners: z.array(z.coerce.number()).min(1),
  tenants: z.array(z.coerce.number()).min(1),
  startDate: z.date(),
  endDate: z.date(),
  periods: z.number().positive().int(),
  rentAmount: z.number().positive().int(),
  // template: __fieldName__: z.__zodType__(),
})
export const UpdateContractSchema = z.object({
  id: z.number(),
  propertyId: z.number(),
  owners: z.array(z.coerce.number()).min(1),
  tenants: z.array(z.coerce.number()).min(1),
  startDate: z.date(),
  endDate: z.date(),
  periods: z.number().positive().int(),
  rentAmount: z.number().positive().int(),
  // template: __fieldName__: z.__zodType__(),
})

export const DeleteContractSchema = z.object({
  id: z.number(),
})
