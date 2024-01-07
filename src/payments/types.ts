import { Prisma } from "@prisma/client"
import { activityWithDetailsInclude } from "src/activities/types"

export const getPaymentsInclude = {
  contract: {
    include: {
      property: true,
      owners: {
        include: {
          client: true,
        },
      },
      tenants: {
        include: {
          client: true,
        },
      },
    },
  },
  items: {
    include: activityWithDetailsInclude,
  },
}

export type PaymentWithDetails = Prisma.PaymentGetPayload<{
  include: typeof getPaymentsInclude
}>
