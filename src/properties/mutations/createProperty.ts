import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreatePropertySchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreatePropertySchema),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const property = await db.property.create({
      data: { ...input, owners: { connect: input.owners?.map((owner) => ({ id: owner })) } },
    })

    return property
  }
)
