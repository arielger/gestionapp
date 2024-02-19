import { ActivityPersonType, ActivityType } from "@prisma/client"
import { z, zodNonEmptyStringValidation } from "src/core/zod"
import { ActivityTransactionType } from "./config"

// TODO: review these types, there is a lot of repetition here
// and a lot of hacks to make zod work

const CreateActivityBaseSchema = z.object({
  // template: __fieldName__: z.__zodType__(),
  amount: z.number(),
  assignedTo: z.nativeEnum(ActivityPersonType),
})

const CreateActivityRentSchema = {
  type: z.literal(ActivityType.RENT),
  details: z.undefined(),
}

const CreateActivityRentFeeSchema = {
  type: z.literal(ActivityType.RENT_FEE),
  details: z.undefined(),
}

const CreateActivityCustomSchema = {
  type: z.literal(ActivityType.CUSTOM),
  details: z.object({
    title: zodNonEmptyStringValidation,
  }),
}

// Form schemas

const CreateActivityBaseFormSchema = CreateActivityBaseSchema.extend({
  transactionType: z.nativeEnum(ActivityTransactionType),
})

export const CreateActivityFormSchema = z.discriminatedUnion("type", [
  CreateActivityBaseFormSchema.extend(CreateActivityRentSchema),
  CreateActivityBaseFormSchema.extend(CreateActivityRentFeeSchema),
  CreateActivityBaseFormSchema.extend(CreateActivityCustomSchema),
])

export type ActivityFormSchemaType = z.infer<typeof CreateActivityFormSchema>

// Mutation schemas

const CreateActivityBaseMutationSchema = CreateActivityBaseSchema.extend({
  contractId: z.number(),
  isDebit: z.boolean(),
})

const mutationSchemas = z.discriminatedUnion("type", [
  CreateActivityBaseMutationSchema.extend(CreateActivityRentSchema),
  CreateActivityBaseMutationSchema.extend(CreateActivityRentFeeSchema),
  CreateActivityBaseMutationSchema.extend(CreateActivityCustomSchema),
])

// need to add input wrapper to fix types
// related bug: https://github.com/blitz-js/blitz/issues/3988#issuecomment-1326566877
export const CreateActivityMutationSchema = z.object({
  input: mutationSchemas,
})

export const UpdateActivityMutationSchema = z.object({
  input: mutationSchemas.and(
    z.object({
      id: z.number(),
    })
  ),
})

export const DeleteActivitySchema = z.object({
  id: z.number(),
})
