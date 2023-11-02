import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetActivity = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(GetActivity),
  resolver.authorize(),
  async ({ id }, ctx) => {
    const activity = await db.activity.findFirst({
      where: { id, organizationId: ctx.session.orgId },
    })

    if (!activity) throw new NotFoundError()

    return activity
  }
)
