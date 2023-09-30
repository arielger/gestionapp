import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteContractSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteContractSchema),
  resolver.authorize(),
  async ({ id }, ctx) => {
    const contract = await db.contract.deleteMany({
      where: { id, organizationId: ctx.session.orgId },
    })

    return contract
  }
)
