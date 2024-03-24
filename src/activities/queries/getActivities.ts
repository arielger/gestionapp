import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import { activityWithDetailsInclude } from "../types"

interface GetActivitiesInput
  extends Pick<Prisma.ActivityFindManyArgs, "where" | "orderBy" | "skip" | "take" | "include"> {
  filterFutureActivities?: boolean
}

export default resolver.pipe(
  resolver.authorize<GetActivitiesInput>(),
  async (
    { where, orderBy, skip = 0, take = 100, filterFutureActivities = false }: GetActivitiesInput,
    ctx
  ) => {
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
            // by default remove future activities from search
            ...(filterFutureActivities
              ? {
                  date: {
                    lte: new Date(),
                  },
                }
              : {}),
          },
          include: activityWithDetailsInclude,
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
