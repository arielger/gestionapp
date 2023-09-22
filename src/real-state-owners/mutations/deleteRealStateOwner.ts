import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteRealStateOwnerSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteRealStateOwnerSchema),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const realStateOwner = await db.realStateOwner.deleteMany({
      where: { id },
    })

    return realStateOwner
  }
)
