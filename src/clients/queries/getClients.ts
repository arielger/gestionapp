import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import { sql } from "kysely"

import { Prisma } from "db"
import { kyselyDb } from "db/kysely"

interface GetClientsInput extends Pick<Prisma.ClientFindManyArgs, "skip" | "take"> {
  type?: "owners" | "tenants"
  fullNameSearch?: string
}

export default resolver.pipe(
  resolver.authorize(),
  async ({ skip = 0, take = 100, type, fullNameSearch }: GetClientsInput, ctx) => {
    const query = kyselyDb
      .selectFrom("Client")
      // filter by client type
      .$if(!!type, (qb) =>
        qb.where(({ exists, selectFrom }) => {
          const key = type === "owners" ? "PropertyOwnerOnProperty" : "TenantOnContract"
          return exists(selectFrom(key).whereRef(`${key}.clientId`, "=", "Client.id"))
        })
      )
      .$if(!!fullNameSearch, (qb) =>
        qb.where(({ eb }) => {
          const firstName = eb.ref("Client.firstName")
          const lastName = eb.ref("Client.lastName")

          const fullNameSearchWithWildcards = `%${fullNameSearch?.toLowerCase()}%`
          return sql`lower(concat(${firstName}, ' ', ${lastName})) LIKE ${fullNameSearchWithWildcards}`
        })
      )
      .where("Client.organizationId", "=", ctx.session.orgId)

    const { items, hasMore, nextPage, count } = await paginate({
      skip,
      take,
      count: async () => {
        const response = await query
          .select(({ fn }) => fn.count<number>("Client.id").as("count"))
          .execute()
        // TODO: review this weird logic
        return response?.[0]?.count ?? 0
      },
      query: (paginateArgs) => {
        return query
          .selectAll("Client")
          .limit(paginateArgs.take)
          .offset(paginateArgs.skip)
          .execute()
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
