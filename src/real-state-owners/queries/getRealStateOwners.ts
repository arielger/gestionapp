import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma, RealStateOwner } from "db"

interface GetRealStateOwnersInput
  extends Pick<
    Prisma.RealStateOwnerFindManyArgs,
    "where" | "orderBy" | "skip" | "take" | "include"
  > {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100, include }: GetRealStateOwnersInput, ctx) => {
    const { items, hasMore, nextPage, count } = await paginate({
      skip,
      take,
      count: () => db.realStateOwner.count({ where }),
      query: (paginateArgs) =>
        db.realStateOwner.findMany({
          ...paginateArgs,
          where: {
            ...where,
            organizationId: ctx.session.orgId,
          },
          orderBy,
          include,
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
