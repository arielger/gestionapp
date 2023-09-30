import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetPropertiesInput
  extends Pick<Prisma.PropertyFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

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
            owners: true,
            Contract: true,
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
