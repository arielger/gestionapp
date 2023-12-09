import React, { useState } from "react"
import { Button, Text, Flex } from "@mantine/core"
import { notifications } from "@mantine/notifications"

import { ContractSearchForm, ContractWithRelatedEntities } from "./ContractSearchForm"
import { getPersonFullName } from "src/real-state-owners/utils"
import { SelectActivitiesTable } from "./SelectActivitiesTable"
import { Activity } from "@prisma/client"
import { useMutation } from "@blitzjs/rpc"
import createPayment from "src/payments/mutations/createPayment"
import { IconCheck } from "@tabler/icons-react"
import router from "next/router"
import { Routes } from "@blitzjs/next"

export function PaymentForm() {
  const [selectedContract, setSelectedContract] = useState<ContractWithRelatedEntities | null>(null)
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([])

  const [createPaymentMutation, { isLoading }] = useMutation(createPayment)

  const noSelectedActivities = !selectedActivities.length

  return (
    <>
      {!selectedContract ? (
        <ContractSearchForm
          onSelectContract={(contract) => {
            setSelectedContract(contract)
          }}
        />
      ) : (
        <>
          <Flex direction="column" mb="lg">
            <Text>Contrato: </Text>
            <Text>Dirección: {selectedContract.property.address}</Text>
            <Text>
              Propietario/s:{" "}
              {selectedContract.owners.map((owner) => getPersonFullName(owner)).join(", ")}
            </Text>
            <Text>
              Inquilino/s:{" "}
              {selectedContract.tenants.map((tenant) => getPersonFullName(tenant)).join(", ")}
            </Text>
            <Button onClick={() => setSelectedContract(null)}>Cambiar contrato</Button>
          </Flex>
          <SelectActivitiesTable
            contractId={selectedContract.id}
            selectedActivities={selectedActivities}
            setSelectedActivities={setSelectedActivities}
          />
          <Flex align="center" gap="sm">
            <Button
              loading={isLoading}
              disabled={noSelectedActivities}
              onClick={async () => {
                await createPaymentMutation({
                  contractId: selectedContract.id,
                  items: selectedActivities.map((activity) => ({
                    id: activity.id,
                    amount: activity.amount,
                    type: activity.type,
                  })),
                })

                notifications.show({
                  title: "Pago registrado exitosamente",
                  message: "",
                  color: "green",
                  icon: <IconCheck />,
                })
                await router.push(
                  Routes.ShowPropertyPage({ propertyId: selectedContract.propertyId })
                )
              }}
            >
              Registrar pago
            </Button>
            {noSelectedActivities && <Text>Aún no seleccionaste ninguna deuda</Text>}
          </Flex>
        </>
      )}
    </>
  )
}
