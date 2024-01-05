import { ActivityType, ActivityPersonType } from "db"
import { ActivityWithDetails } from "./types"

const activityTypeTranslations = {
  RENT: "Alquiler {month}",
  RENT_PAYMENT: "Pago alquiler {month}",
  RENT_FEE: "Comisión pago alquiler {month}",
  CUSTOM: "Manual",
}

export const getActivityTitle = (activity: ActivityWithDetails): string => {
  if (activity.type === ActivityType.CUSTOM) {
    return activity?.customDetails?.title ?? "-"
  }

  if (activity.type === ActivityType.RENT) {
    // initial tenant debit/debt activity
    if (activity.assignedTo === ActivityPersonType.TENANT && activity.isDebit) {
      return activityTypeTranslations.RENT.replace(
        "{month}",
        activity.date.toLocaleString("es-AR", { month: "long" })
      )
    }

    // if tenant is cancelling the rent debt we need to get the data from the related activity to pay
    if (activity.assignedTo === ActivityPersonType.TENANT && !activity.isDebit) {
      return activityTypeTranslations.RENT_PAYMENT.replace(
        "{month}",
        activity.originActivity!.date.toLocaleString("es-AR", { month: "long" })
      )
    }

    // owner credit
    if (activity.assignedTo === ActivityPersonType.OWNER && !activity.isDebit) {
      return activityTypeTranslations.RENT_PAYMENT.replace(
        "{month}",
        activity.originActivity!.originActivity!.date.toLocaleString("es-AR", { month: "long" })
      )
    }
  }

  if (activity.type === ActivityType.RENT_FEE) {
    return activityTypeTranslations.RENT_FEE.replace(
      "{month}",
      activity.originActivity!.originActivity!.originActivity!.date.toLocaleString("es-AR", {
        month: "long",
      })
    )
  }

  return "-"
}
