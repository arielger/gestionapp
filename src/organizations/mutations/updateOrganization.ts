import { resolver } from "@blitzjs/rpc"
import { UpdateOrganizationSchema } from "../schemas"
import db from "db"

export default resolver.pipe(
  resolver.zod(UpdateOrganizationSchema),
  resolver.authorize(),
  async ({ name }, ctx) => {
    const id = ctx.session.orgId

    const organization = await db.organization.update({
      where: {
        id,
      },
      data: {
        name,
      },
    })

    return organization
  }
)
