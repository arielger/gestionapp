import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdatePropertySchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdatePropertySchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const property = await db.property.update({ where: { id }, data })

    return property
  }
)
