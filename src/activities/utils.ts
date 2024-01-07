import { ActivityType, ActivityPersonType } from "db"
import { ActivityWithDetails } from "./types"

const activityTypeTranslations = {
  RENT: "Alquiler {date}",
  RENT_PAYMENT: "Pago alquiler {date}",
  RENT_FEE: "Comisión pago alquiler {date}",
  CUSTOM: "Manual",
}

export const getActivityTitle = (activity: ActivityWithDetails): string => {
  if (activity.type === ActivityType.CUSTOM) {
    return activity?.customDetails?.title ?? "-"
  }

  if (activity.type === ActivityType.RENT) {
    // handle rent debt and payment activities
    if (activity.assignedTo === ActivityPersonType.TENANT) {
      const title = activityTypeTranslations[activity.isDebit ? "RENT_PAYMENT" : "RENT"]

      // if tenant is cancelling the rent debt we need to get the date from the related activity to pay
      const dateActivity = activity.isDebit ? activity : activity.originActivity!

      return title.replace(
        "{date}",
        dateActivity.date.toLocaleString("es-AR", { month: "long", year: "numeric" })
      )
    }

    // owner credit
    if (activity.assignedTo === ActivityPersonType.OWNER && !activity.isDebit) {
      return activityTypeTranslations.RENT_PAYMENT.replace(
        "{date}",
        activity.originActivity!.originActivity!.date.toLocaleString("es-AR", {
          month: "long",
          year: "numeric",
        })
      )
    }
  }

  if (activity.type === ActivityType.RENT_FEE) {
    return activityTypeTranslations.RENT_FEE.replace(
      "{date}",
      activity.originActivity!.originActivity!.originActivity!.date.toLocaleString("es-AR", {
        month: "long",
        year: "numeric",
      })
    )
  }

  return "-"
}
