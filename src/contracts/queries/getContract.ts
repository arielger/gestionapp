import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetContract = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(GetContract),
  resolver.authorize(),
  async ({ id }, ctx) => {
    const contract = await db.contract.findFirst({
      where: { id, organizationId: ctx.session.orgId },
      include: {
        owners: {
          include: {
            client: true,
          },
        },
        tenants: {
          include: {
            client: true,
          },
        },
      },
    })

    if (!contract) throw new NotFoundError()

    return contract
  }
)
