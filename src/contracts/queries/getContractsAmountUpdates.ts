import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

type GetContractsAmountUpdatesInput = Pick<
  Prisma.ContractAmountUpdateFindManyArgs,
  "where" | "orderBy" | "distinct"
>

export default resolver.pipe(
  async ({ where, orderBy, distinct }: GetContractsAmountUpdatesInput) => {
    return db.contractAmountUpdate.findMany({
      where,
      orderBy,
      distinct,
    })
  }
)
