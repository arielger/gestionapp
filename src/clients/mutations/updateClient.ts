import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateClientSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateClientSchema),
  resolver.authorize(),
  async ({ id, address, addressId, ...input }, ctx) => {
    const organizationId = ctx.session.orgId

    const client = await db.client.update({
      where: { id, organizationId: ctx.session.orgId },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        organization: {
          connect: { id: organizationId },
        },
        address: address
          ? {
              upsert: {
                create: {
                  ...address,
                  organization: {
                    connect: { id: organizationId },
                  },
                },
                update: {
                  ...address,
                  organization: {
                    connect: { id: organizationId },
                  },
                },
              },
            }
          : // if address is undefined and there was already an address id, delete the address
          addressId
          ? {
              delete: {
                id: addressId,
              },
            }
          : undefined,
      },
      include: {
        address: true,
      },
    })

    return client
  }
)
