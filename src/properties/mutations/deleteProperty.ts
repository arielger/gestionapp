import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeletePropertySchema } from "../schemas"
import { RelatedExistingEntitiesError } from "src/core/errors"

export default resolver.pipe(
  resolver.zod(DeletePropertySchema),
  resolver.authorize(),
  async ({ id }, ctx) => {
    try {
      const property = await db.property.deleteMany({
        where: { id, organizationId: ctx.session.orgId },
      })

      return property
    } catch (error) {
      if (error.code === "P2003") {
        throw new RelatedExistingEntitiesError()
      }
      throw error
    }
  }
)
