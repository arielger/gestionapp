import { ActivityPersonType, ActivityType } from "@prisma/client"
import { z } from "zod"

const CreateActivityBaseSchema = z.object({
  // template: __fieldName__: z.__zodType__(),
  amount: z.number(),
  isDebit: z.boolean(),
  assignedTo: z.nativeEnum(ActivityPersonType),
  contractId: z.number(),
})

const CreateActivityRentSchema = CreateActivityBaseSchema.extend({
  type: z.literal(ActivityType.RENT),
  details: z.never(),
})

const CreateActivityCustomSchema = CreateActivityBaseSchema.extend({
  type: z.literal(ActivityType.CUSTOM),
  details: z.object({
    title: z.string().min(1),
  }),
})

// need to add input wrapper to fix types
// related bug: https://github.com/blitz-js/blitz/issues/3988#issuecomment-1326566877
export const CreateActivityMutationSchema = z.object({
  input: z.discriminatedUnion("type", [CreateActivityRentSchema, CreateActivityCustomSchema]),
})

// we need to create a separate union without contractId
// https://github.com/colinhacks/zod/discussions/1434#discussioncomment-3746382
export const CreateActivityFormSchema = z.discriminatedUnion("type", [
  CreateActivityRentSchema.omit({ contractId: true }),
  CreateActivityCustomSchema.omit({ contractId: true }),
])

export const UpdateActivitySchema = z.object({
  id: z.number(),
  // template: __fieldName__: z.__zodType__(),
})

export const DeleteActivitySchema = z.object({
  id: z.number(),
})
