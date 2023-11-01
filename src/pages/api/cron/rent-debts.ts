import type { NextApiRequest, NextApiResponse } from "next"

import db, { ActivityType } from "db"

type ResponseData = {
  message: string
}

/*
  Create rent activities at the start of the month for all properties / contracts
*/
export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // get contracts with no rent activity in the current month
  const currentDate = new Date()
  const startOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)

  const contracts = await db.contract.findMany({
    where: {
      Activity: {
        none: {
          createdAt: { gte: startOfCurrentMonth },
        },
      },
    },
  })

  const newRentDebtsActivities = contracts.map((contract) => ({
    organizationId: contract.organizationId,
    amount: contract.rentAmount,
    isDebit: true,
    type: ActivityType.RENT,
    contractId: contract.id,
  }))

  const result = await db.activity.createMany({
    data: newRentDebtsActivities,
  })

  res.status(200).json({ message: `New contracts created: ${result.count}` })
}
