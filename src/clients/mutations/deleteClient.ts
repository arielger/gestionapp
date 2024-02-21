import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteClientSchema } from "../schemas"
import { RelatedExistingEntitiesError } from "src/core/errors"

export default resolver.pipe(
  resolver.zod(DeleteClientSchema),
  resolver.authorize(),
  async ({ id }, ctx) => {
    try {
      const tenant = await db.client.delete({ where: { id, organizationId: ctx.session.orgId } })

      return tenant
    } catch (error) {
      if (error.code === "P2003") {
        throw new RelatedExistingEntitiesError()
      }
      throw error
    }
  }
)
