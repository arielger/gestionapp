import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateClientSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateClientSchema),
  resolver.authorize(),
  async ({ address, ...input }, ctx) => {
    const organizationId = ctx.session.orgId

    const client = await db.client.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        organization: {
          connect: { id: organizationId },
        },
        address: address
          ? {
              create: {
                ...address,
                organization: {
                  connect: { id: organizationId },
                },
              },
            }
          : undefined,
      },
    })

    return client
  }
)
