import { Resend } from "resend"
import { resolver } from "@blitzjs/rpc"
import { z } from "zod"

import PaymentReceiptEmail from "src/emails/payment-receipt"
import getPayment from "src/payments/queries/getPayment"
import { getAddressString } from "src/addresses/utils"
import { generatePaymentReceiptPdf } from "src/payments/pdf"
import { streamToBuffer } from "src/core/files"

const resend = new Resend(process.env.RESEND_API_KEY)

export default resolver.pipe(
  resolver.zod(
    z.object({
      paymentId: z.number(),
    })
  ),
  resolver.authorize(),
  async ({ paymentId }, ctx) => {
    const payment = await getPayment(
      {
        id: Number(paymentId),
      },
      ctx
    )

    const tenantsEmails = payment.contract.tenants
      .map((tenant) => tenant.client.email)
      .filter((email): email is string => !!email)

    const receiptPdf = await generatePaymentReceiptPdf(payment)
    const receiptPdfBuffer = await streamToBuffer(receiptPdf)

    const { data, error } = await resend.emails.send({
      from: "gestion.app <hello@arielgerstein.com>",
      to: tenantsEmails,
      subject: `Recibo de pago`,
      react: PaymentReceiptEmail({
        id: payment.id,
        createdAt: payment.createdAt,
        propertyAddress: getAddressString({ address: payment.contract.property.address }),
      }),
      attachments: [
        {
          filename: "recibo-alquiler.pdf",
          content: receiptPdfBuffer,
        },
      ],
    })

    // TODO: handle error
    console.log("error", error)

    return data
  }
)
