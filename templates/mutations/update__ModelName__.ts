import { resolver } from "@blitzjs/rpc"
import db from "__prismaFolder__"
import { Update__ModelName__Schema } from "../schemas"

export default resolver.pipe(
  resolver.zod(Update__ModelName__Schema),
  resolver.authorize(),
  async ({ id, ...data }, ctx) => {
    const __modelName__ = await db.__modelName__.update({
      where: { id, organizationId: ctx.session.orgId },
      data,
    })

    return __modelName__
  }
)
