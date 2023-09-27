import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteContractSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteContractSchema),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const contract = await db.contract.deleteMany({ where: { id } })

    return contract
  }
)
