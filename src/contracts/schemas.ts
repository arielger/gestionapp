import { ContractFeeType, ContractUpdateType } from "@prisma/client"
import { z, oneOf } from "src/core/zod"
import { updateAmountFrequency } from "./config"

const CreateContractBaseSchema = z.object({
  // We need to use z.coerce because mantine Select only allows
  // string as MultiSelect value
  tenants: z.array(z.coerce.number()).min(1),
  startDate: z.date(),
  endDate: z.date(),

  rentAmount: z.number().positive().int(),
  updateAmountFrequency: oneOf(updateAmountFrequency).optional(),
  updateAmountType: z.nativeEnum(ContractUpdateType).optional(),

  fee: z.number().positive(),
  feeType: z.nativeEnum(ContractFeeType),
})

const getPercentageFeeValidation = (isForm: boolean) =>
  [
    (contract: z.infer<typeof CreateContractBaseSchema>) => {
      const maxValue = isForm ? 100 : 1
      return contract.feeType === ContractFeeType.PERCENTAGE
        ? contract.fee >= 0 && contract.fee <= maxValue
        : true
    },
    "La comisión debe ser un porcentaje entre 0% y 100%",
  ] as const

const requiredUpdateAmountFrequency = [
  (contract: z.infer<typeof CreateContractBaseSchema>) =>
    !!contract.updateAmountType === !!contract.updateAmountFrequency,
  "Debe definirse la frecuencia de actualización solo si se define el tipo de actualización de monto",
] as const

export const CreateContractFormSchema = CreateContractBaseSchema.refine(
  ...getPercentageFeeValidation(true)
).refine(...requiredUpdateAmountFrequency)

export const CreateContractMutationSchema = CreateContractBaseSchema.extend({
  owners: z.array(z.coerce.number()).min(1),
  propertyId: z.number(),
})
  .refine(...getPercentageFeeValidation(false))
  .refine(...requiredUpdateAmountFrequency)

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
