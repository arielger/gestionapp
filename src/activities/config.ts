import { ActivityPersonType, ActivityType } from "@prisma/client"

// we might want to move this to a i18n file
export const activityTypesLabels: Record<ActivityType, string> = {
  RENT_DEBT: "Alquiler",
  RENT_PAYMENT: "Pago de alquiler",
  RENT_OWNER_CREDIT: "Pago de alquiler",
  CUSTOM: "Otro",
}

export const activityPersonLabels: Record<ActivityPersonType, string> = {
  OWNER: "Propietario",
  TENANT: "Inquilino",
}

export enum ActivityTransactionType {
  DEBIT = "DEBIT",
  CREDIT = "CREDIT",
}

export const activitiesWithCreationEnabled = [ActivityType.CUSTOM]
