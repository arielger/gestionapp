import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateTenantSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateTenantSchema),
  resolver.authorize(),
  async (input, ctx) => {
    const tenant = await db.tenant.create({ data: { ...input, organizationId: ctx.session.orgId } })

    return tenant
  }
)
