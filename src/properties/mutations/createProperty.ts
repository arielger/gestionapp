import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreatePropertySchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreatePropertySchema),
  resolver.authorize(),
  async (input, ctx) => {
    const property = await db.property.create({
      data: {
        ...input,
        organizationId: ctx.session.orgId,
        owners: { connect: input.owners?.map((owner) => ({ id: owner })) },
      },
    })

    return property
  }
)
