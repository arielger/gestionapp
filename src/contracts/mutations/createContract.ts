import { resolver } from "@blitzjs/rpc"
import chunk from "lodash/chunk"

import db, { ActivityPersonType, ActivityType, ContractAmountUpdateStatus } from "db"
import { CreateContractMutationSchema } from "../schemas"
import { getContractRentPaymentDates } from "../utils/utils"

export default resolver.pipe(
  resolver.zod(CreateContractMutationSchema),
  resolver.authorize(),
  async (input, ctx) => {
    const rentDates = getContractRentPaymentDates(input.startDate, input.endDate)

    let rentPeriodsByAmountUpdates: Date[][] | undefined
    if (!!input.updateAmountFrequency) {
      // remove the first period since we are using the initial amount for it
      rentPeriodsByAmountUpdates = chunk(rentDates, input.updateAmountFrequency).slice(1)
    }

    const contract = await db.contract.create({
      data: {
        ...input,
        organizationId: ctx.session.orgId,
        owners: {
          create: input.owners?.map((owner) => ({
            organizationId: ctx.session.orgId,
            clientId: owner,
          })),
        },
        tenants: {
          create: input.tenants?.map((owner) => ({
            organizationId: ctx.session.orgId,
            clientId: owner,
          })),
        },
        activities: {
          createMany: {
            data: rentDates.map((rentDate) => ({
              amount: input.rentAmount,
              assignedTo: ActivityPersonType.TENANT,
              isDebit: true,
              type: ActivityType.RENT_DEBT,
              organizationId: ctx.session.orgId,
              date: rentDate,
            })),
          },
        },
        amountUpdates: rentPeriodsByAmountUpdates
          ? {
              createMany: {
                data: rentPeriodsByAmountUpdates.map((periodRentDays) => ({
                  status: ContractAmountUpdateStatus.INITIAL,
                  // all period chunks will have at least one date
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  updateDate: periodRentDays[0]!,
                })),
              },
            }
          : undefined,
      },
    })

    return contract
  }
)
