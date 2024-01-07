import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetPaymentsInput
  extends Pick<Prisma.PaymentFindManyArgs, "where" | "orderBy" | "skip" | "take" | "include"> {}

export default resolver.pipe(
  resolver.authorize<GetPaymentsInput>(),
  async ({ where, orderBy, include, skip = 0, take = 100 }: GetPaymentsInput, ctx) => {
    const { items, hasMore, nextPage, count } = await paginate({
      skip,
      take,
      count: () => db.payment.count({ where }),
      query: (paginateArgs) =>
        db.payment.findMany({
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
