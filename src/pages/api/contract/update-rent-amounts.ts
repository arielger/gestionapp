import { Ctx } from "@blitzjs/next"
import { AuthenticationError } from "blitz"
import type { NextApiRequest, NextApiResponse } from "next"
import db, { Prisma } from "db"
import { api } from "src/blitz-server"

import getContractsAmountUpdates from "src/contracts/queries/getContractsAmountUpdates"
import { ActivityType, ContractAmountUpdateStatus } from "@prisma/client"
import { getIpcRate, getIpcValues } from "src/contracts/inflation-indexes/ipc"

/*
  This endpoint will update the contract amounts based on inflation data (IPC) from previous months
*/
export default api(async (req: NextApiRequest, res: NextApiResponse, ctx: Ctx) => {
  try {
    // this endpoint is only called by a CRON job
    // so we secure it by checking for Vercel Authorization header
    // https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs
    const authHeader = req.headers.authorization
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new AuthenticationError()
    }

    const ipcValues = await getIpcValues()

    const executionDate = new Date()

    const contractAmountUpdatesInclude = {
      contract: true,
    }

    // Get all contract updates that should be executed (updateDate already passed + INITIAL status)
    const amountUpdates = (await getContractsAmountUpdates(
      {
        where: {
          updateDate: {
            lte: executionDate,
          },
          status: ContractAmountUpdateStatus.INITIAL,
        },
        orderBy: [
          {
            contractId: "asc",
          },
          {
            // get the earliest update first
            updateDate: "asc",
          },
        ],
        include: contractAmountUpdatesInclude,
      },
      ctx
    )) as unknown as Prisma.ContractAmountUpdateGetPayload<{
      include: typeof contractAmountUpdatesInclude
    }>[]

    for (const amountUpdate of amountUpdates) {
      const ipcRate = getIpcRate({
        ipcValues,
        updateDate: amountUpdate.updateDate,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        rangeMonths: amountUpdate.contract.updateAmountFrequency!,
      })

      // TODO: add error handling
      if (!ipcRate) return

      const firstUpdatedActivity = await db.activity.findFirst({
        select: {
          amount: true,
        },
        where: {
          contract: {
            id: amountUpdate.contractId,
          },
          type: ActivityType.RENT_DEBT,
          date: {
            gte: amountUpdate.updateDate,
          },
        },
      })
      const newRentAmount = firstUpdatedActivity!.amount * ipcRate

      await db.contractAmountUpdate.update({
        data: {
          executedAt: new Date(),
          percentageVariation: ipcRate,
          status: ContractAmountUpdateStatus.EXECUTED,
          previousRentAmount: firstUpdatedActivity!.amount,
          newRentAmount: newRentAmount,

          contract: {
            update: {
              activities: {
                updateMany: {
                  where: {
                    type: ActivityType.RENT_DEBT,
                    date: {
                      gte: amountUpdate.updateDate,
                    },
                  },
                  data: {
                    amount: newRentAmount,
                  },
                },
              },
            },
          },
        },
        where: {
          id: amountUpdate.id,
        },
      })
    }

    res.send("SUCCESS")
  } catch (error) {
    console.log("ERROR", JSON.stringify(error, null, 2))
    res.send(error)
  }
})
