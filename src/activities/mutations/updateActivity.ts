import { resolver } from "@blitzjs/rpc"
import db, { ActivityType } from "db"
import { UpdateActivityMutationSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateActivityMutationSchema),
  resolver.authorize(),
  async ({ input }, ctx) => {
    const { details, id, contractId, ...activityData } = input

    const detailsWithOrg = {
      organization: {
        connect: { id: ctx.session.orgId },
      },
      ...details,
    }

    const activity = await db.activity.update({
      where: { id, organizationId: ctx.session.orgId },
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
                upsert: {
                  create: detailsWithOrg,
                  update: detailsWithOrg,
                },
              },
            }
          : {}),
      },
    })

    return activity
  }
)
