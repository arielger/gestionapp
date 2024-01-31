import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdatePropertyMutationSchema } from "../schemas"
import { getPropertyInclude } from "../queries/getProperty"

export default resolver.pipe(
  resolver.zod(UpdatePropertyMutationSchema),
  resolver.authorize(),
  async ({ id, address, ...data }, ctx) => {
    const property = await db.property.update({
      where: { id, organizationId: ctx.session.orgId },
      data: {
        ...data,
        owners: {
          upsert: data.owners.map((ownerId) => ({
            where: { clientId_propertyId: { clientId: ownerId, propertyId: id } },
            update: {},
            create: {
              clientId: ownerId,
              organizationId: ctx.session.orgId,
            },
          })),
          deleteMany: {
            propertyId: id,
            clientId: { notIn: data.owners },
          },
        },
        address: {
          upsert: {
            create: address,
            update: address,
          },
        },
      },
      include: getPropertyInclude,
    })

    return property
  }
)
