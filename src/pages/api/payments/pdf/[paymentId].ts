import { Ctx } from "@blitzjs/next"
import type { NextApiRequest, NextApiResponse } from "next"
import { getActivityTitle } from "src/activities/utils"
import { api } from "src/blitz-server"
import { getPersonFullName } from "src/clients/utils"

import getPayment from "src/payments/queries/getPayment"
import { getPaymentAmount } from "src/payments/utils"

export default api(async (req: NextApiRequest, res: NextApiResponse, ctx: Ctx) => {
  ctx.session.$authorize()

  const { paymentId } = req.query

  const payment = await getPayment(
    {
      id: Number(paymentId),
    },
    ctx
  )

  const PDFDocument = require("pdfkit")
  const doc = new PDFDocument()

  doc.text(`#${payment.id}`)
  doc.text(payment.organization.name)
  doc.text("Recibo de pago")
  doc.text(payment.createdAt.toLocaleDateString())

  const tenants = payment.contract.tenants.map((t) => t.client)

  doc.text(`Nombre: ${tenants.map((t) => getPersonFullName(t))}`)

  doc.text(`Dirección: ${payment.contract.property.address}`)

  payment.items.forEach((item) =>
    doc.text(`${getActivityTitle(item)} - ${new Intl.NumberFormat().format(item.amount)}`)
  )

  doc.text(`Total: ${getPaymentAmount(payment)}`)

  doc.end()

  res.setHeader("Content-Type", "application/pdf")
  res.send(doc)
})
