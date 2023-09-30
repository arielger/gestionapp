import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateTenantSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateTenantSchema),
  resolver.authorize(),
  async ({ id, ...data }, ctx) => {
    const tenant = await db.tenant.update({
      where: { id, organizationId: ctx.session.orgId },
      data,
    })

    return tenant
  }
)
