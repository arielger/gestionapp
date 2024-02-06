import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreatePropertyMutationSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreatePropertyMutationSchema),
  resolver.authorize(),
  async ({ address, ...input }, ctx) => {
    const organizationId = ctx.session.orgId

    const property = await db.property.create({
      data: {
        ...input,
        organization: {
          connect: { id: organizationId },
        },
        owners: {
          create: input.owners?.map((owner) => ({
            clientId: owner,
            organizationId,
          })),
        },
        address: {
          create: {
            ...address,
            organization: {
              connect: { id: organizationId },
            },
          },
        },
      },
    })

    return property
  }
)
