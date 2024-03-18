import { Ctx } from "@blitzjs/next"
import { AuthenticationError } from "blitz"
import type { NextApiRequest, NextApiResponse } from "next"
import axios from "axios"
import db from "db"
import { api } from "src/blitz-server"

import getContractsAmountUpdates from "src/contracts/queries/getContractsAmountUpdates"
import { ActivityType, ContractAmountUpdateStatus } from "@prisma/client"
import { subMonths } from "date-fns"

// TODO: review how to handle csrf when calling from Vercel

export default api(async (req: NextApiRequest, res: NextApiResponse, ctx: Ctx) => {
  console.log("UPDATE")
  // this endpoint is only called by a CRON job
  // so we secure it by checking for Vercel Authorization header
  // https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs
  // const authHeader = req.headers.authorization
  // console.log("req.headers.authorization", req.headers.authorization)
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return new AuthenticationError()
  // }

  // @TODO: check if it's better to save this in the db
  // const ipcResponse = await axios.get(
  //   "https://apis.datos.gob.ar/series/api/series/?ids=148.3_INIVELNAL_DICI_M_26&limit=5000&format=json"
  // )

  // console.log("ipcResponse", ipcResponse.data.data)

  /*
    1 MVP solution: update rent based on provisional index
    (since we don't have the latest IPC we use the previos month data)

    1.1 Get all PROVISIONAL updates that are not executed and which date already passed
    (we do the update at the first day of the month)
    Get the earliest update for each contractId

    2. Real solution
    Update amounts when we have the real IPC index 
  */

  const executionDate = new Date("2024-09-02") // TEST DATE - remove

  const amountUpdates = await getContractsAmountUpdates(
    {
      where: {
        updateDate: {
          lte: executionDate,
        },
        status: ContractAmountUpdateStatus.INITIAL,
      },
      orderBy: [
        {
          // get the earlier update first
          updateDate: "asc",
        },
        {
          contractId: "asc",
        },
      ],
    },
    ctx
  )

  // get activities related to the contracts
  const activityPeriodsToUpdate = await Promise.all(
    amountUpdates.map(async (amountUpdate) => ({
      amountUpdate,
      contract: await db.contract.findUniqueOrThrow({
        where: {
          id: amountUpdate.contractId,
        },
      }),
      activities: await db.activity.findMany({
        where: {
          type: ActivityType.RENT_DEBT,
          date: {
            gte: amountUpdate.updateDate,
          },
          contractId: amountUpdate.contractId,
        },
      }),
    }))
  )

  activityPeriodsToUpdate.forEach(({ amountUpdate, contract, activities }) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const firstIpcMonth = subMonths(amountUpdate.updateDate, 1 + contract.updateAmountFrequency!)
    const lastIpcMonth = subMonths(amountUpdate.updateDate, 1)
    console.log("period", [firstIpcMonth, lastIpcMonth])
  })

  res.send(activityPeriodsToUpdate)
})
