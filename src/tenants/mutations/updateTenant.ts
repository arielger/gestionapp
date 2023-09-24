import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateTenantSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateTenantSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const tenant = await db.tenant.update({ where: { id }, data })

    return tenant
  }
)
