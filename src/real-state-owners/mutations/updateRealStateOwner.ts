import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateRealStateOwnerSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateRealStateOwnerSchema),
  resolver.authorize(),
  async ({ id, ...data }, ctx) => {
    const realStateOwner = await db.realStateOwner.update({
      where: { id, organizationId: ctx.session.orgId },
      data,
    })

    return realStateOwner
  }
)
