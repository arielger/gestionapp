import React, { useState } from "react"
import { DataTable } from "mantine-datatable"
import { Flex, Text } from "@mantine/core"
import { useQuery } from "@blitzjs/rpc"

import getActivities from "src/activities/queries/getActivities"
import { Activity } from "@prisma/client"

export function SelectActivitiesTable({
  contractId,
  selectedActivities,
  setSelectedActivities,
}: {
  contractId: number
  selectedActivities: Activity[]
  setSelectedActivities: (activities: Activity[]) => void
}) {
  const [currentDate] = useState(new Date())

  const [activitiesData, { isLoading: isLoadingActivities }] = useQuery(
    getActivities,
    {
      where: {
        contractId,
        isDebit: true,
        date: {
          lte: currentDate,
        },
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
        // minHeight={!searchedContracts?.length ? 200 : undefined}
        // noRecordsText="No se encontraron contratos relacionados a la búsqueda"
        fetching={isLoadingActivities}
        withBorder
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
