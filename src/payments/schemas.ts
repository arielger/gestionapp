import { ActivityType } from "@prisma/client"
import { z } from "src/core/zod"

export const CreatePaymentSchema = z.object({
  // template: __fieldName__: z.__zodType__(),
  contractId: z.number(),
  items: z.array(
    z.object({
      // activity to pay id
      id: z.number(),
      // amount to pay for this activity
      amount: z.number(),
      type: z.nativeEnum(ActivityType),
    })
  ),
})

export const DeletePaymentSchema = z.object({
  id: z.number(),
})
