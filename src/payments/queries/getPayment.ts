import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetPayment = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(GetPayment),
  resolver.authorize(),
  async ({ id }, ctx) => {
    const payment = await db.payment.findFirst({
      where: { id, organizationId: ctx.session.orgId },
    })

    if (!payment) throw new NotFoundError()

    return payment
  }
)
