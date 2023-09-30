import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "__prismaFolder__"
import { z } from "zod"

const Get__ModelName__ = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(Get__ModelName__),
  resolver.authorize(),
  async ({ id }, ctx) => {
    const __modelName__ = await db.__modelName__.findFirst({
      where: { id, organizationId: ctx.session.orgId },
    })

    if (!__modelName__) throw new NotFoundError()

    return __modelName__
  }
)
