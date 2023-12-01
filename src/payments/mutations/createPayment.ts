import { resolver } from "@blitzjs/rpc"
import db, { ActivityPersonType, ActivityType } from "db"
import { CreatePaymentSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreatePaymentSchema),
  resolver.authorize(),
  async (input, ctx) => {
    const payment = await db.payment.create({
      data: {
        date: input.date,
        contractId: input.contractId,
        organizationId: ctx.session.orgId,
        items: {
          createMany: {
            data: [
              {
                organizationId: ctx.session.orgId,
                amount: input.rentAmount,
                isDebit: false,
                type: ActivityType.RENT,
                contractId: input.contractId,
                assignedTo: ActivityPersonType.TENANT,
              },
            ],
          },
        },
      },
    })

    return payment
  }
)
