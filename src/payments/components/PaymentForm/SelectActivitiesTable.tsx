import React, { useState } from "react"
import { Flex, Text } from "@mantine/core"
import { useQuery } from "@blitzjs/rpc"

import getActivities from "src/activities/queries/getActivities"
import { Activity, ActivityPersonType } from "@prisma/client"
import { DataTable } from "src/core/components/DataTable"

export function SelectActivitiesTable({
  contractId,
  selectedActivities,
  setSelectedActivities,
}: {
  contractId: number
  selectedActivities: Activity[]
  setSelectedActivities: (activities: Activity[]) => void
}) {
  const [activitiesData, { isLoading: isLoadingActivities }] = useQuery(
    getActivities,
    {
      where: {
        contractId,
        isDebit: true,
        assignedTo: ActivityPersonType.TENANT,
        // Filter activities that aren't paid
        // TODO: Handle partial payment
        relatedActivities: {
          none: {},
        },
      },
    },
    {
      suspense: false,
      keepPreviousData: true,
    }
  )

  const totalDebt = activitiesData?.items.reduce((acc, activity) => acc + activity.amount, 0) ?? 0
  const selectedActivitiesAmount = selectedActivities.reduce(
    (acc, activity) => acc + activity.amount,
    0
  )
  const remainingDebt = totalDebt - selectedActivitiesAmount

  return (
    <>
      <Text mb="sm">Seleccioná las deudas a pagar</Text>
      <DataTable
        fetching={isLoadingActivities}
        withColumnBorders
        records={activitiesData?.items ?? []}
        selectedRecords={selectedActivities}
        onSelectedRecordsChange={setSelectedActivities}
        columns={[
          {
            accessor: "date",
            title: "Fecha",
            render: (activity) => activity.date.toLocaleDateString(),
          },
          { accessor: "amount", title: "Monto" },
          { accessor: "type", title: "Tipo" },
        ]}
      />
      <Flex direction="column" justify="space-between" p="sm">
        {activitiesData?.items && selectedActivities.length > 0 && (
          <>
            <Text>Deuda total: {new Intl.NumberFormat().format(totalDebt)}</Text>
            <Text>
              Total seleccionado: {new Intl.NumberFormat().format(selectedActivitiesAmount)}
            </Text>
            {remainingDebt > 0 && (
              <Text>Deuda restante: {new Intl.NumberFormat().format(remainingDebt)}</Text>
            )}
          </>
        )}
      </Flex>
    </>
  )
}
