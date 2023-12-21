import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateClientSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateClientSchema),
  resolver.authorize(),
  async (input, ctx) => {
    const client = await db.client.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        organizationId: ctx.session.orgId,
      },
    })

    return client
  }
)
