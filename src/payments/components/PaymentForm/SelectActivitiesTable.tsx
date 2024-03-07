import React, { useEffect, useState } from "react"
import { Button, Flex, Text, Tooltip } from "@mantine/core"
import { useMutation, useQuery } from "@blitzjs/rpc"

import getActivities from "src/activities/queries/getActivities"
import { Activity, ActivityPersonType, Contract } from "@prisma/client"
import { DataTable } from "src/core/components/DataTable"
import createPayment from "src/payments/mutations/createPayment"
import { getActivityTitle } from "src/activities/utils"
import { showSuccessNotification } from "src/core/notifications"

export function SelectActivitiesTable({
  contract,
  onCreatePayment,
}: {
  contract: Contract
  onCreatePayment?: (paymentId: number) => void
}) {
  const [activitiesData, { isLoading: isLoadingActivities, refetch: refetchActivities }] = useQuery(
    getActivities,
    {
      where: {
        contractId: contract.id,
        isDebit: true,
        assignedTo: ActivityPersonType.TENANT,
        // ActivityType.RENT_DEBT =>
        // filter already paid activities
        rentPaymentDebtPaidByActivity: {
          is: null,
        },
      },
    },
    {
      suspense: false,
      // TODO: review => this is caching the data forever
      staleTime: Infinity, // prevent refetching
    }
  )

  const [createPaymentMutation, { isLoading }] = useMutation(createPayment)

  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([])

  useEffect(() => {
    if (activitiesData?.items) {
      setSelectedActivities(activitiesData.items)
    }
  }, [activitiesData?.items, setSelectedActivities])

  const totalDebt = activitiesData?.items.reduce((acc, activity) => acc + activity.amount, 0) ?? 0
  const selectedActivitiesAmount = selectedActivities.reduce(
    (acc, activity) => acc + activity.amount,
    0
  )
  const remainingDebt = totalDebt - selectedActivitiesAmount

  const noSelectedActivities = !selectedActivities.length

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
            width: 100,
          },
          { accessor: "type", title: "Tipo", render: getActivityTitle },
          {
            accessor: "amount",
            title: "Monto",
            render: (activity) => Intl.NumberFormat().format(activity.amount),
          },
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
      <Tooltip label="Aún no seleccionaste ningúna deuda" disabled={!noSelectedActivities}>
        <Button
          loading={isLoading}
          disabled={noSelectedActivities}
          onClick={async () => {
            const payment = await createPaymentMutation({
              contractId: contract.id,
              items: selectedActivities.map((activity) => ({
                id: activity.id,
                amount: activity.amount,
                type: activity.type,
              })),
            })

            showSuccessNotification({
              title: "Pago registrado exitosamente",
              message: "",
            })

            void refetchActivities()
            onCreatePayment?.(payment.id)
          }}
        >
          Registrar pago
        </Button>
      </Tooltip>
    </>
  )
}
