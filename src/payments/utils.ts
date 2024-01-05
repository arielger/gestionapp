import { Prisma } from "db"
import { formatMoneyAmount } from "src/core/numbers/utils"

type PaymentWithItems = Prisma.PaymentGetPayload<{
  include: {
    items: true
  }
}>

export const getPaymentAmount = (paymentWithItems: PaymentWithItems) => {
  const amount = paymentWithItems.items.reduce((acc, item) => acc + item.amount, 0)
  return formatMoneyAmount(amount)
}
