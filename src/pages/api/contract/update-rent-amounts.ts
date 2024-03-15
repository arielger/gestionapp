import { Ctx } from "@blitzjs/next"
import { AuthenticationError } from "blitz"
import type { NextApiRequest, NextApiResponse } from "next"
import axios from "axios"
import { api } from "src/blitz-server"

import getContractsAmountUpdates from "src/contracts/queries/getContractsAmountUpdates"
import { ContractAmountUpdateStatus } from "@prisma/client"

// TODO: review how to handle csrf when calling from Vercel

export default api(async (req: NextApiRequest, res: NextApiResponse, ctx: Ctx) => {
  // this endpoint is only called by a CRON job
  // so we secure it by checking for Vercel Authorization header
  // https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs
  const authHeader = req.headers.authorization
  console.log("req.headers.authorization", req.headers.authorization)
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new AuthenticationError()
  }

  // @TODO: check if it's better to save this in the db
  const ipcResponse = await axios.get(
    "https://apis.datos.gob.ar/series/api/series/?ids=148.3_INIVELNAL_DICI_M_26&limit=5000&format=json"
  )

  const amountUpdates = await getContractsAmountUpdates(
    {
      where: {
        updateDate: {
          lte: new Date(),
        },
        status: {
          in: [
            ContractAmountUpdateStatus.INITIAL,
            ContractAmountUpdateStatus.EXECUTED_WITH_PROVISIONAL_INDEX,
          ],
        },
      },
      orderBy: {
        // get the earlier update first
        updateDate: "asc",
      },
      distinct: ["contractId", "updateDate"],
    },
    ctx
  )

  // get activities related to the contracts

  console.log("amountUpdates", amountUpdates)

  res.send(ipcResponse.data.data)
})
