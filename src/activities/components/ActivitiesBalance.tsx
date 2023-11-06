import { Table, Text } from "@mantine/core"
import { Activity, ActivityPersonType, ActivityType } from "@prisma/client"

const activityTypeTranslations: Record<ActivityType, string> = {
  RENT: "Alquiler *mes*",
}

const emptyTableCells = [<td></td>, <td></td>, <td></td>]

export const ActivitiesBalance = ({ activities }: { activities: Activity[] }) => {
  return (
    <Table withBorder withColumnBorders>
      <thead>
        <tr>
          <th colSpan={2}>General</th>
          <th colSpan={3}>Propietario</th>
          <th colSpan={3}>Inquilino</th>
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
            (rowsWithBalances, activity) => {
              const detailsTableCells = [
                <td key="created-at">{activity.createdAt.toLocaleString()}</td>,
                <td key="activity-type">{activityTypeTranslations[activity.type]}</td>,
              ]

              const isTenantMovement = activity.assignedTo === ActivityPersonType.TENANT

              // TODO: complete logic
              let ownerBalance = rowsWithBalances.ownerBalance + activity.amount
              let tenantBalance = rowsWithBalances.tenantBalance + activity.amount

              const cells = [
                ...(!activity.isDebit ? [<td></td>] : []),
                <td key="amount">
                  <Text c={activity.isDebit ? "red" : "green"}>
                    {activity.isDebit ? "-" : "+"}
                    {new Intl.NumberFormat().format(activity.amount)}
                  </Text>
                </td>,
                ...(activity.isDebit ? [<td></td>] : []),
                <td>{isTenantMovement ? tenantBalance : ownerBalance}</td>,
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
                rows: [...rowsWithBalances, row],
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
