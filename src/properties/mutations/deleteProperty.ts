import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeletePropertySchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeletePropertySchema),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const property = await db.property.deleteMany({ where: { id } })

    return property
  }
)
