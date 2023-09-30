import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteRealStateOwnerSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteRealStateOwnerSchema),
  resolver.authorize(),
  async ({ id }, ctx) => {
    const realStateOwner = await db.realStateOwner.deleteMany({
      where: { id, organizationId: ctx.session.orgId },
    })

    return realStateOwner
  }
)
