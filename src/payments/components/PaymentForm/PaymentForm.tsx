import React, { useState } from "react"
import { z } from "zod"
import { Button, Text, Flex, NumberInput } from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"

import Form, { FormProps } from "src/core/components/Form"
import { ContractSearchForm, ContractWithRelatedEntities } from "./ContractSearchForm"
import { getPersonFullName } from "src/real-state-owners/utils"

export function PaymentForm<S extends z.ZodType<any, any>>({
  initialValues,
  ...props
}: FormProps<S>) {
  const [selectedContract, setSelectedContract] = useState<ContractWithRelatedEntities | null>(null)

  return (
    <>
      {selectedContract ? (
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
          <Form
            initialValues={{
              date: new Date(),
              contractId: selectedContract.id,
              rentAmount: selectedContract.rentAmount,
            }}
            {...props}
          >
            {(form) => {
              return (
                <>
                  <Text>Monto total: {selectedContract.rentAmount}</Text>
                  <NumberInput
                    label="Monto a pagar"
                    hideControls
                    {...form.getInputProps("rentAmount")}
                  />
                  <DatePickerInput label="Fecha" {...form.getInputProps("date")} />
                </>
              )
            }}
          </Form>
        </>
      ) : (
        <ContractSearchForm
          onSelectContract={(contract) => {
            setSelectedContract(contract)
          }}
        />
      )}
    </>
  )
}
