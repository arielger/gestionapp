import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetRealStateOwner = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(GetRealStateOwner),
  resolver.authorize(),
  async ({ id }, ctx) => {
    const realStateOwner = await db.realStateOwner.findFirst({
      where: { id, organizationId: ctx.session.orgId },
    })

    if (!realStateOwner) throw new NotFoundError()

    return realStateOwner
  }
)
