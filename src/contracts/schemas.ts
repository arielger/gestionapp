import { ContractFeeType } from "@prisma/client"
import { z } from "src/core/zod"

const CreateContractBaseSchema = z.object({
  // We need to use z.coerce because mantine Select only allows
  // string as MultiSelect value
  tenants: z.array(z.coerce.number()).min(1),
  startDate: z.date(),
  endDate: z.date(),
  rentAmount: z.number().positive().int(),
  fee: z.number().positive(),
  feeType: z.nativeEnum(ContractFeeType),
})

const getPercentageFeeValidation = (isForm: boolean) =>
  [
    (value) => {
      const maxValue = isForm ? 100 : 1
      return value.feeType === ContractFeeType.PERCENTAGE
        ? value.fee >= 0 && value.fee <= maxValue
        : true
    },
    "La comisión debe ser un porcentaje entre 0% y 100%",
  ] as const

export const CreateContractFormSchema = CreateContractBaseSchema.refine(
  ...getPercentageFeeValidation(true)
)

export const CreateContractMutationSchema = CreateContractBaseSchema.extend({
  owners: z.array(z.coerce.number()).min(1),
  propertyId: z.number(),
}).refine(...getPercentageFeeValidation(false))

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
