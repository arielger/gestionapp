import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteActivitySchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteActivitySchema),
  resolver.authorize(),
  async ({ id }, ctx) => {
    const activity = await db.activity.deleteMany({
      where: { id, organizationId: ctx.session.orgId },
    })

    return activity
  }
)
