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

    const orgConnection = {
      organization: {
        connect: { id: ctx.session.orgId },
      },
    }

    const contractConnection = {
      contract: {
        connect: { id: input.contractId },
      },
    }

    const paymentActivities: Prisma.PaymentCreateInput["items"] = {
      create: input.items.map((activity) => {
        if (activity.type === ActivityType.RENT_DEBT) {
          return {
            // Register payment and add current debt activity id to the details
            ...orgConnection,
            ...contractConnection,
            amount: activity.amount,
            isDebit: false,
            type: ActivityType.RENT_PAYMENT,
            assignedTo: ActivityPersonType.TENANT,
            rentPaymentDetails: {
              create: {
                organization: {
                  connect: { id: ctx.session.orgId },
                },
                rentDebtActivity: {
                  connect: { id: activity.id },
                },
              },
            },

            // Create credit activity for the owner (minus commissions)
            rentOwnerCreditPaymentActivity: {
              create: {
                ...orgConnection,
                activity: {
                  create: {
                    ...contractConnection,
                    ...orgConnection,
                    amount:
                      activity.amount -
                      (contract.feeType === ContractFeeType.FIXED
                        ? contract.fee
                        : activity.amount * contract.fee),
                    isDebit: false,
                    type: ActivityType.RENT_OWNER_CREDIT,
                    assignedTo: ActivityPersonType.OWNER,

                    // TODO: add commission
                  },
                },
                rentDebtActivity: {
                  connect: { id: activity.id },
                },
              },
            },
          }
        }

        // TODO: handle custom activities payment

        throw new Error("Debt activity paid not handled correctly")
      }),
    }

    const payment = await db.payment.create({
      data: {
        ...orgConnection,
        ...contractConnection,
        items: paymentActivities,
      },
    })

    return payment
  }
)
