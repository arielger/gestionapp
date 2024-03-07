import { Prisma } from "db"

export const activityWithDetailsInclude = {
  customDetails: true,

  // RENT_DEBT
  rentPaymentDebtPaidByActivity: true,

  // RENT_PAYMENT
  rentPaymentDetails: {
    include: {
      rentDebtActivity: true,
    },
  },

  // RENT_OWNER_CREDIT
  rentOwnerCreditDetails: {
    include: {
      rentDebtActivity: true,
    },
  },
}

export type ActivityWithDetails = Prisma.ActivityGetPayload<{
  include: typeof activityWithDetailsInclude
}>
