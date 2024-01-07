import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateClientSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateClientSchema),
  resolver.authorize(),
  async ({ id, ...data }, ctx) => {
    const client = await db.client.update({
      where: { id, organizationId: ctx.session.orgId },
      data,
    })

    return client
  }
)
