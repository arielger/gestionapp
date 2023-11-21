import { resolver } from "@blitzjs/rpc"
import db, { ActivityType } from "db"
import { UpdateActivityMutationSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateActivityMutationSchema),
  resolver.authorize(),
  async ({ input }, ctx) => {
    const { details, id, ...activityData } = input

    const activity = await db.activity.update({
      where: { id, organizationId: ctx.session.orgId },
      data: {
        ...activityData,
        organizationId: ctx.session.orgId,
        ...(input.type === ActivityType.CUSTOM
          ? {
              customDetails: {
                upsert: {
                  create: details!,
                  update: details!,
                },
              },
            }
          : {}),
      },
    })

    return activity
  }
)
