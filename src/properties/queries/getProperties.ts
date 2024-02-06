import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

type GetPropertiesInput = Pick<Prisma.PropertyFindManyArgs, "where" | "orderBy" | "skip" | "take">

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetPropertiesInput, ctx) => {
    const { items, hasMore, nextPage, count } = await paginate({
      skip,
      take,
      count: () => db.property.count({ where }),
      query: (paginateArgs) =>
        db.property.findMany({
          ...paginateArgs,
          where: {
            ...where,
            organizationId: ctx.session.orgId,
          },
          orderBy,
          include: {
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
              },
            },
            address: true,
          },
        }),
    })

    return {
      items,
      nextPage,
      hasMore,
      count,
    }
  }
)
