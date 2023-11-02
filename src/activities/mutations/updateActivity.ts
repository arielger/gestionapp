import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateActivitySchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateActivitySchema),
  resolver.authorize(),
  async ({ id, ...data }, ctx) => {
    const activity = await db.activity.update({
      where: { id, organizationId: ctx.session.orgId },
      data,
    })

    return activity
  }
)
