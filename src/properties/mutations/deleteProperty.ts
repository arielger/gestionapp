import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeletePropertySchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeletePropertySchema),
  resolver.authorize(),
  async ({ id }, ctx) => {
    const property = await db.property.deleteMany({
      where: { id, organizationId: ctx.session.orgId },
    })

    return property
  }
)
