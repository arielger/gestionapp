import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import { sql } from "kysely"
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres"
import db, { Prisma } from "db"

import { kyselyDb } from "db/kysely"

interface GetRealStateOwnersInput extends Pick<Prisma.RealStateOwnerFindManyArgs, "skip" | "take"> {
  fullNameSearch?: string
  includeRelatedEntities?: boolean
}

export default resolver.pipe(
  resolver.authorize(),
  async (
    {
      skip = 0,
      take = 100,
      includeRelatedEntities = false,
      fullNameSearch,
    }: GetRealStateOwnersInput,
    ctx
  ) => {
    const { items, hasMore, nextPage, count } = await paginate({
      skip,
      take,
      // TODO: review how to handle count
      count: () => db.realStateOwner.count(),
      query: (paginateArgs) => {
        let query = kyselyDb
          .selectFrom("RealStateOwner")
          .selectAll("RealStateOwner")
          .$if(!!fullNameSearch, (qb) =>
            qb.where(({ eb }) => {
              const firstName = eb.ref("RealStateOwner.firstName")
              const lastName = eb.ref("RealStateOwner.lastName")

              const fullNameSearchWithWildcards = `%${fullNameSearch?.toLowerCase()}%`
              return sql`lower(concat(${firstName}, ' ', ${lastName})) LIKE ${fullNameSearchWithWildcards}`
            })
          )
          .$if(includeRelatedEntities, (qb) =>
            qb
              .innerJoin(
                "_ContractToRealStateOwner",
                "_ContractToRealStateOwner.B",
                "RealStateOwner.id"
              )
              .select((eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom("Contract")
                    .selectAll("Contract")
                    .innerJoin("_ContractToTenant", "_ContractToTenant.A", "Contract.id")
                    .select((eb) => [
                      jsonObjectFrom(
                        eb
                          .selectFrom("Property")
                          .selectAll("Property")
                          .whereRef("Contract.propertyId", "=", "Property.id")
                      ).as("property"),
                      jsonArrayFrom(
                        eb
                          .selectFrom("Tenant")
                          .selectAll("Tenant")
                          .whereRef("Tenant.id", "=", "_ContractToTenant.B")
                      ).as("tenants"),
                      jsonArrayFrom(
                        eb
                          .selectFrom("RealStateOwner")
                          .selectAll("RealStateOwner")
                          .whereRef("RealStateOwner.id", "=", "_ContractToRealStateOwner.B")
                      ).as("owners"),
                    ])
                    .whereRef("Contract.id", "=", "_ContractToRealStateOwner.A")
                ).as("contracts")
              )
          )
          .limit(paginateArgs.take)
          .offset(paginateArgs.skip)

        return query.execute()
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
