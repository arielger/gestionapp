import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

type GetContractsAmountUpdatesInput = Pick<
  Prisma.ContractAmountUpdateFindManyArgs,
  "where" | "orderBy" | "distinct" | "include"
>

export default resolver.pipe(
  async ({ where, orderBy, distinct, include }: GetContractsAmountUpdatesInput) => {
    return db.contractAmountUpdate.findMany({
      where,
      orderBy,
      distinct,
      include,
    })
  }
)
