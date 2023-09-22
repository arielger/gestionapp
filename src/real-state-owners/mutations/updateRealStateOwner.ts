import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateRealStateOwnerSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateRealStateOwnerSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const realStateOwner = await db.realStateOwner.update({
      where: { id },
      data,
    })

    return realStateOwner
  }
)
