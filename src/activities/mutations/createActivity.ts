import { resolver } from "@blitzjs/rpc"
import db, { ActivityType } from "db"
import { CreateActivityMutationSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateActivityMutationSchema),
  resolver.authorize(),
  async ({ input }, ctx) => {
    const { details, contractId, ...activityData } = input

    const detailsWithOrg = {
      organization: {
        connect: { id: ctx.session.orgId },
      },
      ...details,
    }

    const activity = await db.activity.create({
      data: {
        ...activityData,
        organization: {
          connect: { id: ctx.session.orgId },
        },
        contract: {
          connect: { id: contractId },
        },
        ...(input.type === ActivityType.CUSTOM
          ? {
              customDetails: {
                create: detailsWithOrg,
              },
            }
          : {}),
      },
    })

    return activity
  }
)
