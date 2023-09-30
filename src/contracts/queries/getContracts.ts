import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetContractsInput
  extends Pick<Prisma.ContractFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetContractsInput, ctx) => {
    const { items, hasMore, nextPage, count } = await paginate({
      skip,
      take,
      count: () => db.contract.count({ where }),
      query: (paginateArgs) =>
        db.contract.findMany({
          ...paginateArgs,
          where: {
            ...where,
            organizationId: ctx.session.orgId,
          },
          orderBy,
          include: { owners: true, tenants: true },
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
