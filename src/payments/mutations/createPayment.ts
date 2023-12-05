import { resolver } from "@blitzjs/rpc"
import db, { ActivityPersonType, ActivityType, ContractFeeType, Prisma } from "db"
import { CreatePaymentSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreatePaymentSchema),
  resolver.authorize(),
  async (input, ctx) => {
    const contract = await db.contract.findUnique({
      where: { id: input.contractId },
    })

    if (!contract) {
      throw new Error("Contract not found")
    }

    const payment = await db.payment.create({
      data: {
        contractId: input.contractId,
        organizationId: ctx.session.orgId,
        items: {
          create: input.items.map((activity) => ({
            organizationId: ctx.session.orgId,
            amount: activity.amount,
            isDebit: false,
            type: activity.type,
            contractId: input.contractId,
            assignedTo: ActivityPersonType.TENANT,
            originActivityId: activity.id,

            // Create owner credit and fee activities
            ...(activity.type === ActivityType.RENT
              ? {
                  relatedActivities: {
                    create: {
                      organizationId: ctx.session.orgId,
                      amount: activity.amount,
                      isDebit: false,
                      type: ActivityType.RENT,
                      contractId: input.contractId,
                      assignedTo: ActivityPersonType.OWNER,
                      relatedActivities: {
                        create: {
                          organizationId: ctx.session.orgId,
                          amount:
                            contract.feeType === ContractFeeType.FIXED
                              ? contract.fee
                              : activity.amount * contract.fee,
                          isDebit: true,
                          type: ActivityType.RENT_FEE,
                          contractId: input.contractId,
                          assignedTo: ActivityPersonType.OWNER,
                        },
                      },
                    },
                  },
                }
              : {}),
          })),
        },
      },
    })

    return payment
  }
)
