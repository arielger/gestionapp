import { z } from "zod"

export const CreatePaymentSchema = z.object({
  // template: __fieldName__: z.__zodType__(),
  contractId: z.number(),
  date: z.date(),
  rentAmount: z.number(),
})
export const UpdatePaymentSchema = CreatePaymentSchema.merge(
  z.object({
    id: z.number(),
  })
)

export const DeletePaymentSchema = z.object({
  id: z.number(),
})
