import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdatePaymentSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdatePaymentSchema),
  resolver.authorize(),
  async ({ id, ...data }, ctx) => {
    const payment = await db.payment.update({
      where: { id, organizationId: ctx.session.orgId },
      data,
    })

    return payment
  }
)
