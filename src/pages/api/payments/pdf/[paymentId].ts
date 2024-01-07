import { Ctx } from "@blitzjs/next"
import type { NextApiRequest, NextApiResponse } from "next"
import { getActivityTitle } from "src/activities/utils"
import { api } from "src/blitz-server"
import { getPersonFullName } from "src/clients/utils"
import createPdfDocument from "pdfkit-table"
import { Resend } from "resend"

import getPayment from "src/payments/queries/getPayment"
import { getPaymentAmount } from "src/payments/utils"
import { PaymentReceiptEmail } from "src/payments/emails/PaymentReceiptEmail"

const resend = new Resend(process.env.RESEND_API_KEY)

export default api(async (req: NextApiRequest, res: NextApiResponse, ctx: Ctx) => {
  ctx.session.$authorize()

  const { paymentId } = req.query

  const payment = await getPayment(
    {
      id: Number(paymentId),
    },
    ctx
  )

  const doc = new createPdfDocument()

  doc.info["Title"] = `Recibo de pago #${payment.id}`

  doc.fontSize(16)
  doc.text("Recibo de pago")

  const headerInfoY = doc.y

  doc.fontSize(12)
  doc.text(`Número: ${payment.id}`)
  doc.text(`Fecha: ${payment.createdAt.toLocaleDateString()}`)

  var columnGap = 36
  var columns = 2
  var fullWidth = doc.page.width - doc.page.margins.right
  var columnWidth = (fullWidth - columnGap * (columns - 1)) / columns

  doc.text(payment.organization.name, columnWidth, headerInfoY, {
    align: "right",
  })
  // TODO: Complete with real org data
  doc.text("Av. Juan D. Perón 2462", {
    align: "right",
  })
  doc.text("4228 0488 / 4208 9827", {
    align: "right",
  })

  doc.moveDown()
  const tenants = payment.contract.tenants.map((t) => t.client)
  doc.text(`Nombre: ${tenants.map((t) => getPersonFullName(t))}`, doc.page.margins.left)

  doc.moveDown()

  doc.fontSize(14)
  const table = {
    title: payment.contract.property.address,
    headers: ["Detalle", "Periodo", "Monto"],
    rows: payment.items.map((item) => [
      getActivityTitle(item),
      "",
      new Intl.NumberFormat().format(item.amount),
    ]),
  }
  await doc.table(table, {
    prepareRow: () => doc.font("Helvetica").fontSize(10),
  })

  doc.text(`Total: ${getPaymentAmount(payment)}`)

  doc.end()

  const { data, error } = await resend.emails.send({
    from: "Grupo Gestionar <grupogestionar@resend.dev>",
    to: ["arielgers@gmail.com"],
    subject: "Recibo de pago #1",
    react: PaymentReceiptEmail({ id: "1" }),
  })

  res.setHeader("Content-Type", "application/pdf")
  res.send(doc)
})
