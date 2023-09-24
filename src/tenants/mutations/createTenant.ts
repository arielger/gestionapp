import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateTenantSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateTenantSchema),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const tenant = await db.tenant.create({ data: input })

    return tenant
  }
)
