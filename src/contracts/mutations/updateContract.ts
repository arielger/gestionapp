import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateContractSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateContractSchema),
  resolver.authorize(),
  async ({ id, ...data }, ctx) => {
    const contract = await db.contract.update({
      where: { id, organizationId: ctx.session.orgId },
      data: {
        ...data,
        owners: { connect: data.owners?.map((owner) => ({ id: owner })) },
        tenants: { connect: data.tenants?.map((tenant) => ({ id: tenant })) },
      },
      include: {
        owners: true,
        tenants: true,
      },
    })

    return contract
  }
)
