import { resolver } from "@blitzjs/rpc"
import db, { ActivityPersonType } from "db"
import { CreatePaymentSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreatePaymentSchema),
  resolver.authorize(),
  async (input, ctx) => {
    const payment = await db.payment.create({
      data: {
        contractId: input.contractId,
        organizationId: ctx.session.orgId,
        items: {
          createMany: {
            data: input.items.map((activity) => ({
              organizationId: ctx.session.orgId,
              amount: activity.amount,
              isDebit: false,
              type: activity.type,
              contractId: input.contractId,
              assignedTo: ActivityPersonType.TENANT,
              activityToPayId: activity.id,
            })),
          },
        },
      },
    })

    return payment
  }
)
