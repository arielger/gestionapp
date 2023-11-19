import { resolver } from "@blitzjs/rpc"
import db, { ActivityType } from "db"
import { CreateActivityMutationSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateActivityMutationSchema),
  resolver.authorize(),
  async ({ input }, ctx) => {
    const { details, ...activityData } = input

    const activity = await db.activity.create({
      data: {
        ...activityData,
        organizationId: ctx.session.orgId,
        ...(input.type === ActivityType.CUSTOM
          ? {
              customDetails: {
                create: details,
              },
            }
          : {}),
      },
    })

    return activity
  }
)
