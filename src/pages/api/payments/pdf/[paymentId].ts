import { Ctx } from "@blitzjs/next"
import type { NextApiRequest, NextApiResponse } from "next"
import { api } from "src/blitz-server"

import getPayment from "src/payments/queries/getPayment"
import { generatePaymentReceiptPdf } from "src/payments/pdf"

export default api(async (req: NextApiRequest, res: NextApiResponse, ctx: Ctx) => {
  ctx.session.$authorize()

  const { paymentId } = req.query

  const payment = await getPayment(
    {
      id: Number(paymentId),
    },
    ctx
  )

  const paymentPdf = await generatePaymentReceiptPdf(payment)

  res.setHeader("Content-Type", "application/pdf")
  res.send(paymentPdf)
})
