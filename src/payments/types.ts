import { Prisma } from "@prisma/client"
import { activityWithDetailsInclude } from "src/activities/types"

export const getPaymentsInclude = {
  contract: {
    include: {
      property: {
        include: {
          address: true,
        },
      },
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
  organization: true,
}

export type PaymentWithDetails = Prisma.PaymentGetPayload<{
  include: typeof getPaymentsInclude
}>
