import { resolver } from "@blitzjs/rpc"
import db from "__prismaFolder__"
import { Delete__ModelName__Schema } from "../schemas"

export default resolver.pipe(
  resolver.zod(Delete__ModelName__Schema),
  resolver.authorize(),
  async ({ id }, ctx) => {
    const __modelName__ = await db.__modelName__.deleteMany({
      where: { id, organizationId: ctx.session.orgId },
    })

    return __modelName__
  }
)
