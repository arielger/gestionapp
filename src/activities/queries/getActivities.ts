import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetActivitiesInput
  extends Pick<Prisma.ActivityFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetActivitiesInput, ctx) => {
    const { items, hasMore, nextPage, count } = await paginate({
      skip,
      take,
      count: () => db.activity.count({ where }),
      query: (paginateArgs) =>
        db.activity.findMany({
          ...paginateArgs,
          where: {
            ...where,
            organizationId: ctx.session.orgId,
          },
          include: {
            customDetails: true,
          },
          orderBy,
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
