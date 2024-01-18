import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetProperty = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export const getPropertyInclude = {
  owners: {
    include: {
      client: true,
    },
  },
  contracts: {
    include: {
      tenants: {
        include: {
          client: true,
        },
      },
      owners: {
        include: {
          client: true,
        },
      },
    },
  },
}

export default resolver.pipe(
  resolver.zod(GetProperty),
  resolver.authorize(),
  async ({ id }, ctx) => {
    const property = await db.property.findFirst({
      where: { id, organizationId: ctx.session.orgId },
      include: getPropertyInclude,
    })

    if (!property) throw new NotFoundError()

    return property
  }
)
