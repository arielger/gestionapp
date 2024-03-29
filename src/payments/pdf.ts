import createPdfDocument from "pdfkit-table"

import { getActivityTitle } from "src/activities/utils"
import { getPersonFullName } from "src/clients/utils"
import { getPaymentAmount } from "src/payments/utils"
import { getAddressString } from "src/addresses/utils"
import { PaymentWithDetails } from "./types"

export const generatePaymentReceiptPdf = async (payment: PaymentWithDetails) => {
  const doc = new createPdfDocument()

  doc.info["Title"] = `Recibo de pago #${payment.id}`

  doc.fontSize(16)
  doc.text("Recibo de pago")

  const headerInfoY = doc.y

  doc.fontSize(12)
  doc.text(`Número: ${payment.id}`)
  doc.text(`Fecha: ${payment.createdAt.toLocaleDateString()}`)

  const columnGap = 36
  const columns = 2
  const fullWidth = doc.page.width - doc.page.margins.right
  const columnWidth = (fullWidth - columnGap * (columns - 1)) / columns

  doc.text(payment.organization.name, columnWidth, headerInfoY, {
    align: "right",
  })
  // TODO: Complete with real org data
  doc.text("Dirección: -", {
    align: "right",
  })
  doc.text("Teléfono: -", {
    align: "right",
  })

  doc.moveDown()
  const tenants = payment.contract.tenants.map((t) => t.client)
  doc.text(`Nombre: ${tenants.map((t) => getPersonFullName(t))}`, doc.page.margins.left)

  doc.moveDown()

  doc.fontSize(14)
  const table = {
    title: getAddressString({
      address: payment.contract.property.address,
    }),
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

  return doc
}
