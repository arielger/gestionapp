import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteClientSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteClientSchema),
  resolver.authorize(),
  async ({ id }, ctx) => {
    const tenant = await db.client.deleteMany({ where: { id, organizationId: ctx.session.orgId } })

    return tenant
  }
)
