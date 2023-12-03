import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeletePaymentSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeletePaymentSchema),
  resolver.authorize(),
  async ({ id }, ctx) => {
    const payment = await db.payment.deleteMany({
      where: { id, organizationId: ctx.session.orgId },
    })

    return payment
  }
)
