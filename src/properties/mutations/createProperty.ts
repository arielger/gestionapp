import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreatePropertyMutationSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreatePropertyMutationSchema),
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
