import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetContractsInput
  extends Pick<Prisma.ContractFindManyArgs, "where" | "orderBy" | "skip" | "take"> {
  searchBy: "owners" | "tenants" | "address"
  searchText: string
}

const contractsInclude = {
  owners: {
    include: {
      client: true,
    },
  },
  tenants: {
    include: {
      client: true,
    },
  },
  property: true,
}

export type ContractWithRelatedEntities = Prisma.ContractGetPayload<{
  include: typeof contractsInclude
}>

export default resolver.pipe(
  resolver.authorize(),
  async (
    { where, orderBy, skip = 0, take = 100, searchBy, searchText }: GetContractsInput,
    ctx
  ) => {
    const { items, hasMore, nextPage, count } = await paginate({
      skip,
      take,
      count: () =>
        // TODO: fix count fn
        db.contract.count({
          where: {
            ...where,
            organizationId: ctx.session.orgId,
          },
        }),
      query: (paginateArgs) => {
        return db.contract.findMany({
          ...paginateArgs,
          where: {
            ...where,
            organizationId: ctx.session.orgId,
            ...(searchBy === "owners" || searchBy === "tenants"
              ? {
                  [searchBy]: {
                    some: {
                      client: {
                        OR: [
                          {
                            firstName: {
                              contains: searchText,
                              mode: "insensitive",
                            },
                          },
                          {
                            lastName: {
                              contains: searchText,
                              mode: "insensitive",
                            },
                          },
                        ],
                      },
                    },
                  },
                }
              : {}),
            ...(searchBy === "address"
              ? {
                  property: {
                    address: {
                      contains: searchText,
                      mode: "insensitive",
                    },
                  },
                }
              : {}),
          },
          orderBy,
          include: contractsInclude,
        })
      },
    })

    return {
      items,
      nextPage,
      hasMore,
      count,
    }
  }
)
