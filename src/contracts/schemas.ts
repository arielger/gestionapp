import { ContractFeeType } from "@prisma/client"
import { z } from "zod"

const CreateContractBaseSchema = z.object({
  // We need to use z.coerce because mantine Select only allows
  // string as MultiSelect value
  owners: z.array(z.coerce.number()).min(1),
  tenants: z.array(z.coerce.number()).min(1),
  startDate: z.date(),
  endDate: z.date(),
  rentAmount: z.number().positive().int(),
  // TODO: add validation for feeType percentage (0 to 1)
  // when adding discriminatedUnion we need to create lots of different schemas (check)
  fee: z.number().positive(),
  feeType: z.nativeEnum(ContractFeeType),
  // template: __fieldName__: z.__zodType__(),
})

const percentageFeeValidation = [
  (value) => {
    return value.feeType === ContractFeeType.PERCENTAGE ? value.fee >= 0 && value.fee <= 1 : true
  },
  "La comisión debe ser un porcentaje entre 0% y 100%",
] as const

export const CreateContractFormSchema = CreateContractBaseSchema.refine(...percentageFeeValidation)

export const CreateContractMutationSchema = CreateContractBaseSchema.extend({
  propertyId: z.number(),
}).refine(...percentageFeeValidation)

export const UpdateContractSchema = z.object({
  id: z.number(),
  propertyId: z.number(),
  owners: z.array(z.coerce.number()).min(1),
  tenants: z.array(z.coerce.number()).min(1),
  startDate: z.date(),
  endDate: z.date(),
  rentAmount: z.number().positive().int(),
  // template: __fieldName__: z.__zodType__(),
})

export const DeleteContractSchema = z.object({
  id: z.number(),
})
