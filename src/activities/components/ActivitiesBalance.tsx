import { Table, Text } from "@mantine/core"
import { Activity, ActivityPersonType, ActivityType } from "@prisma/client"

const activityTypeTranslations: Record<ActivityType, string> = {
  RENT: "Alquiler {month}",
}

const getActivityTitle = (activity: Activity): string => {
  if (activity.type === ActivityType.RENT) {
    return activityTypeTranslations.RENT.replace(
      "{month}",
      activity.createdAt.toLocaleString("default", { month: "long" })
    )
  }

  return activityTypeTranslations[activity.type]
}

const emptyTableCells = [<td key="empty-1"></td>, <td key="empty-2"></td>, <td key="empty-3"></td>]

export const ActivitiesBalance = ({ activities }: { activities: Activity[] }) => {
  return (
    <Table withBorder withColumnBorders>
      <thead>
        <tr>
          <th colSpan={2}>General</th>
          <th colSpan={3}>Inquilino</th>
          <th colSpan={3}>Propietario</th>
        </tr>
        <tr>
          <th>Fecha</th>
          <th>Tipo</th>
          <th>Debe</th>
          <th>Haber</th>
          <th>Saldo</th>
          <th>Debe</th>
          <th>Haber</th>
          <th>Saldo</th>
        </tr>
      </thead>
      <tbody>
        {
          activities.reduce(
            (acc, activity) => {
              const detailsTableCells = [
                <td key="created-at">{activity.createdAt.toLocaleString()}</td>,
                <td key="activity-type">{getActivityTitle(activity)}</td>,
              ]

              const isTenantMovement = activity.assignedTo === ActivityPersonType.TENANT

              let ownerBalance =
                acc.ownerBalance + (activity.isDebit ? -activity.amount : activity.amount)
              let tenantBalance =
                acc.tenantBalance + (activity.isDebit ? -activity.amount : activity.amount)

              // if the activity is of type credit we show it in second place
              const cells = [
                ...(!activity.isDebit ? [<td key="empty-cell"></td>] : []),
                <td key="amount">
                  <Text c={activity.isDebit ? "red" : "green"}>
                    {activity.isDebit ? "-" : "+"}
                    {new Intl.NumberFormat().format(activity.amount)}
                  </Text>
                </td>,
                ...(activity.isDebit ? [<td key="empty-cell"></td>] : []),
                <td key="balance">
                  {new Intl.NumberFormat().format(isTenantMovement ? tenantBalance : ownerBalance)}
                </td>,
              ]

              const row = (
                <tr key={activity.id}>
                  {[
                    ...detailsTableCells,
                    // we show the tenant balance data first
                    ...(isTenantMovement
                      ? [...cells, ...emptyTableCells]
                      : [...emptyTableCells, ...cells]),
                  ]}
                </tr>
              )

              return {
                rows: [...acc.rows, row],
                ownerBalance,
                tenantBalance,
              }
            },
            { rows: [], ownerBalance: 0, tenantBalance: 0 }
          ).rows
        }
      </tbody>
    </Table>
  )
}
