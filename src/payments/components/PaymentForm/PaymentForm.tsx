import React, { useState } from "react"
import { Button, Text, Flex, Paper } from "@mantine/core"

import { ContractSearchForm } from "./ContractSearchForm"
import { SelectActivitiesTable } from "./SelectActivitiesTable"
import { ContractWithRelatedEntities } from "src/contracts/queries/getContracts"
import { PersonList } from "src/clients/components/PersonList"
import { getAddressString } from "src/properties/utils"

export function PaymentForm() {
  const [selectedContract, setSelectedContract] = useState<
    ContractWithRelatedEntities | undefined
  >()

  if (!selectedContract) {
    return (
      <Paper shadow="xs" p="xl">
        <ContractSearchForm
          onSelectContract={(contract) => {
            setSelectedContract(contract)
          }}
        />
      </Paper>
    )
  }

  return (
    <>
      <Paper shadow="xs" p="md" mb="md">
        <Flex direction="column">
          <Flex justify="space-between">
            <Text>Contrato: </Text>
            <Button size="xs" variant="light" onClick={() => setSelectedContract(undefined)}>
              Cambiar
            </Button>
          </Flex>
          <Text>
            Dirección:{" "}
            {getAddressString({
              address: selectedContract?.property?.address,
            })}
          </Text>
          <Text>
            Propietario/s:{" "}
            <PersonList list={selectedContract.owners.map((owner) => owner.client)} />
          </Text>
          <Text>
            Inquilino/s:{" "}
            <PersonList list={selectedContract.tenants.map((tenant) => tenant.client)} />
          </Text>
        </Flex>
      </Paper>
      <Paper shadow="xs" p="xl">
        <SelectActivitiesTable
          contract={selectedContract}
          onCreatePayment={() => {
            // TODO: check how to show payment details
          }}
        />
      </Paper>
    </>
  )
}
