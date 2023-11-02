import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateActivitySchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateActivitySchema),
  resolver.authorize(),
  async (input, ctx) => {
    const activity = await db.activity.create({
      data: {
        ...input,
        organizationId: ctx.session.orgId,
      },
    })

    return activity
  }
)
