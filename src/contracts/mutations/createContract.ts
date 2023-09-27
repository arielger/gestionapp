import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateContractSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateContractSchema),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const contract = await db.contract.create({
      data: {
        ...input,
        owners: { connect: input.owners?.map((owner) => ({ id: owner })) },
        tenants: { connect: input.tenants?.map((tenant) => ({ id: tenant })) },
      },
    })

    return contract
  }
)
