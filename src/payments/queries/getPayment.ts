import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "src/core/zod"
import { getPaymentsInclude } from "../types"

const GetPayment = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.authorize(),
  resolver.zod(GetPayment),
  async ({ id }, ctx) => {
    const payment = await db.payment.findFirst({
      where: { id, organizationId: ctx.session.orgId },
      include: getPaymentsInclude,
    })

    if (!payment) throw new NotFoundError()

    return payment
  }
)
