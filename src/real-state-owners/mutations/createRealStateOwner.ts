import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateRealStateOwnerSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateRealStateOwnerSchema),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const realStateOwner = await db.realStateOwner.create({ data: input })

    return realStateOwner
  }
)
