import { Prisma } from "db"

export const activityWithDetailsInclude = {
  customDetails: true,
  // todo: review this nesting - code smell
  originActivity: {
    include: {
      originActivity: {
        include: {
          originActivity: true,
        },
      },
    },
  },
}

export type ActivityWithDetails = Prisma.ActivityGetPayload<{
  include: typeof activityWithDetailsInclude
}>
