import { ActivityPersonType, ActivityType } from "@prisma/client"
import { z } from "zod"
import { ActivityTransactionType } from "./config"

const CreateActivityBaseSchema = z.object({
  // template: __fieldName__: z.__zodType__(),
  amount: z.number(),
  assignedTo: z.nativeEnum(ActivityPersonType),
})

const CreateActivityRentSchema = {
  type: z.literal(ActivityType.RENT),
  details: z.never(),
}

const CreateActivityCustomSchema = {
  type: z.literal(ActivityType.CUSTOM),
  details: z.object({
    title: z.string().min(1),
  }),
}

// Form schemas

const CreateActivityBaseFormSchema = CreateActivityBaseSchema.extend({
  transactionType: z.nativeEnum(ActivityTransactionType),
})

export const CreateActivityFormSchema = z.discriminatedUnion("type", [
  CreateActivityBaseFormSchema.extend(CreateActivityRentSchema),
  CreateActivityBaseFormSchema.extend(CreateActivityCustomSchema),
])

// Mutation schemas

const CreateActivityBaseMutationSchema = CreateActivityBaseSchema.extend({
  contractId: z.number(),
  isDebit: z.boolean(),
})

// need to add input wrapper to fix types
// related bug: https://github.com/blitz-js/blitz/issues/3988#issuecomment-1326566877
export const CreateActivityMutationSchema = z.object({
  input: z.discriminatedUnion("type", [
    CreateActivityBaseMutationSchema.extend(CreateActivityRentSchema),
    CreateActivityBaseMutationSchema.extend(CreateActivityCustomSchema),
  ]),
})

export const UpdateActivitySchema = z.object({
  id: z.number(),
  // template: __fieldName__: z.__zodType__(),
})

export const DeleteActivitySchema = z.object({
  id: z.number(),
})
