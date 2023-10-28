import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdatePropertySchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdatePropertySchema),
  resolver.authorize(),
  async ({ id, ...data }, ctx) => {
    const property = await db.property.update({
      where: { id, organizationId: ctx.session.orgId },
      data: { ...data, owners: { set: data.owners?.map((owner) => ({ id: owner })) } },
      include: {
        owners: true,
        Contract: {
          include: {
            tenants: true,
          },
        },
      },
    })

    return property
  }
)
