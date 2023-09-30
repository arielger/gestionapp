import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateRealStateOwnerSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateRealStateOwnerSchema),
  resolver.authorize(),
  async (input, ctx) => {
    const realStateOwner = await db.realStateOwner.create({
      data: { ...input, organizationId: ctx.session.orgId },
    })

    return realStateOwner
  }
)
