import { ActivityPersonType, ActivityType } from "@prisma/client"
import { z } from "zod"

export const CreateActivitySchema = z.object({
  // template: __fieldName__: z.__zodType__(),
  amount: z.number(),
  isDebit: z.boolean(),
  type: z.nativeEnum(ActivityType),
  contractId: z.number(),
  assignedTo: z.nativeEnum(ActivityPersonType),
})
export const UpdateActivitySchema = z.object({
  id: z.number(),
  // template: __fieldName__: z.__zodType__(),
})

export const DeleteActivitySchema = z.object({
  id: z.number(),
})
