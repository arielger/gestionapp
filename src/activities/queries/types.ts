import { Prisma } from "db"

export type ActivityWithDetails = Prisma.ActivityGetPayload<{
  include: { customDetails: true }
}>
