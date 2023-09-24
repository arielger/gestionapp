import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteTenantSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteTenantSchema),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const tenant = await db.tenant.deleteMany({ where: { id } })

    return tenant
  }
)
