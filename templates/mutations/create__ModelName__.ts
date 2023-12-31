import { resolver } from "@blitzjs/rpc"
import db from "__prismaFolder__"
import { Create__ModelName__Schema } from "../schemas"

export default resolver.pipe(
  resolver.zod(Create__ModelName__Schema),
  resolver.authorize(),
  async (input, ctx) => {
    const __modelName__ = await db.__modelName__.create({
      data: {
        ...input,
        organizationId: ctx.session.orgId,
      },
    })

    return __modelName__
  }
)
