import { resolver } from "@blitzjs/rpc"
import db, { ActivityPersonType, ActivityType } from "db"
import { CreateContractMutationSchema } from "../schemas"
import { getContractRentPaymentDates } from "../utils/utils"

export default resolver.pipe(
  resolver.zod(CreateContractMutationSchema),
  resolver.authorize(),
  async (input, ctx) => {
    const rentDates = getContractRentPaymentDates(input.startDate, input.endDate)

    const contract = await db.contract.create({
      data: {
        ...input,
        organizationId: ctx.session.orgId,
        owners: { connect: input.owners?.map((owner) => ({ id: owner })) },
        tenants: { connect: input.tenants?.map((tenant) => ({ id: tenant })) },
        activities: {
          createMany: {
            data: rentDates.map((rentDate) => ({
              amount: input.rentAmount,
              assignedTo: ActivityPersonType.TENANT,
              isDebit: true,
              type: ActivityType.RENT,
              organizationId: ctx.session.orgId,
              date: rentDate,
            })),
          },
        },
      },
    })

    return contract
  }
)
