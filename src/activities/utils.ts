import { ActivityType } from "db"
import { ActivityWithDetails } from "./types"

const activityTypeTranslations = {
  RENT_DEBT: "Alquiler {date}",
  RENT_PAYMENT: "Pago alquiler {date}",
  RENT_OWNER_CREDIT: "Pago alquiler {date}",
  CUSTOM: "Manual",
} satisfies Record<ActivityType, string>

export const getActivityTitle = (activity: ActivityWithDetails): string => {
  if (activity.type === ActivityType.CUSTOM) {
    return activity?.customDetails?.title ?? "-"
  }

  if (activity.type === ActivityType.RENT_DEBT) {
    return activityTypeTranslations.RENT_DEBT.replace(
      "{date}",
      activity.date.toLocaleString("es-AR", { month: "long", year: "numeric" })
    )
  }

  if (activity.type === ActivityType.RENT_PAYMENT) {
    return activityTypeTranslations.RENT_PAYMENT.replace(
      "{date}",
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      activity.rentPaymentDetails!.rentDebtActivity.date.toLocaleString("es-AR", {
        month: "long",
        year: "numeric",
      })
    )
  }

  if (activity.type === ActivityType.RENT_OWNER_CREDIT) {
    return activityTypeTranslations.RENT_OWNER_CREDIT.replace(
      "{date}",
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      activity.rentOwnerCreditDetails!.rentDebtActivity.date.toLocaleString("es-AR", {
        month: "long",
        year: "numeric",
      })
    )
  }

  return "-"
}
