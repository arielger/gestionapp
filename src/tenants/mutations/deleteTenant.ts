import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteTenantSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteTenantSchema),
  resolver.authorize(),
  async ({ id }, ctx) => {
    const tenant = await db.tenant.deleteMany({ where: { id, organizationId: ctx.session.orgId } })

    return tenant
  }
)
