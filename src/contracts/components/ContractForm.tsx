import React from "react"
import {
  Accordion,
  ComboboxItem,
  Flex,
  MultiSelect,
  NumberInput,
  Select,
  Table,
  Text,
} from "@mantine/core"
import { DateInput } from "@mantine/dates"

import { z } from "src/core/zod"
import { Form, FormProps } from "src/core/components/Form"
import { getContractRentPaymentDates } from "../utils/utils"
import { ContractFeeType, ContractUpdateType } from "@prisma/client"
import { ClientsSelect } from "src/clients/components/ClientsSelect"
import { updateAmountFrequency } from "../config"
import chunk from "lodash/chunk"

export function ContractForm<S extends z.ZodType<any, any>>({
  ownersInitialValue = [],
  ...props
}: FormProps<S> & { ownersInitialValue?: ComboboxItem[] }) {
  return (
    <Form<S>
      initialValues={{
        feeType: ContractFeeType.PERCENTAGE,
        fee: 10,
        updateAmountType: undefined,
        updateAmountFrequency: undefined,
      }}
      {...props}
    >
      {(form) => {
        return (
          <Flex direction="column" gap="sm">
            <MultiSelect
              label="Propietario/s"
              data={ownersInitialValue}
              disabled
              value={ownersInitialValue.map((o) => o.value)}
            />
            {/* TODO: prevent adding owners as tenants */}
            <ClientsSelect
              label="Inquilino/s"
              initialValues={[]}
              {...form.getInputProps("tenants")}
            />
            <Flex direction="row" gap="md">
              <DateInput
                style={{ flex: 1 }}
                label="Inicio"
                popoverProps={{ withinPortal: true }}
                placeholder="YYYY-MM-DD"
                valueFormat="YYYY-MM-DD"
                {...form.getInputProps("startDate")}
              />
              <DateInput
                style={{ flex: 1 }}
                label="Fin"
                popoverProps={{ withinPortal: true }}
                minDate={form.values.startDate}
                placeholder="YYYY-MM-DD"
                valueFormat="YYYY-MM-DD"
                {...form.getInputProps("endDate")}
              />
            </Flex>
            <NumberInput
              label="Monto"
              hideControls
              allowNegative={false}
              {...form.getInputProps("rentAmount")}
            />

            <Text>Actualización</Text>
            <Flex direction="row" gap="md">
              <Select
                style={{ flex: 1 }}
                label="Tipo"
                data={[
                  { value: "NONE", label: "Sin actualización" },
                  { value: ContractUpdateType.INDEX_IPC, label: "Indice IPC" },
                ]}
                {...form.getInputProps("updateAmountType")}
                // transform value from "NONE" string to undefined for mantine select to work
                value={form.getInputProps("updateAmountType").value ?? "NONE"}
                onChange={(newValue) => {
                  form
                    .getInputProps("updateAmountType")
                    .onChange(newValue === "NONE" ? undefined : newValue)

                  // reset frequency if type is set to NONE
                  if (!!form.values.updateAmountType && newValue === "NONE") {
                    return form.getInputProps("updateAmountFrequency").onChange(undefined)
                  }

                  // set default frequency if setting update type
                  if (!form.values.updateAmountType && newValue !== "NONE") {
                    return form.getInputProps("updateAmountFrequency").onChange(6)
                  }
                }}
              />
              {!!form.values.updateAmountType && (
                <Select
                  label="Periodicidad (en meses)"
                  data={updateAmountFrequency.map((n) => `${n}`)}
                  allowDeselect={false}
                  {...form.getInputProps("updateAmountFrequency")}
                  // transform value from number to string for mantine select to work
                  value={form.getInputProps("updateAmountFrequency").value?.toString()}
                  onChange={(value) => {
                    form
                      .getInputProps("updateAmountFrequency")
                      .onChange(value ? Number(value) : undefined)
                  }}
                  checkIconPosition="right"
                />
              )}
            </Flex>

            {!!form.values.startDate && !!form.values.startDate && !!form.values.rentAmount && (
              <Accordion defaultValue="rent" variant="contained">
                <Accordion.Item value="rent">
                  <Accordion.Control>Detalles cobro mensual</Accordion.Control>
                  <Accordion.Panel>
                    <Table>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Periodo</Table.Th>
                          <Table.Th>Monto</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {chunk(
                          getContractRentPaymentDates(form.values.startDate, form.values.endDate),
                          form.values.updateAmountFrequency ?? Infinity
                        ).map((contractAmountPeriodDates, i) => {
                          const period = [
                            contractAmountPeriodDates[0],
                            contractAmountPeriodDates.at(-1),
                          ]
                            .filter(Boolean)
                            .map((d) => d?.toLocaleDateString())
                            .join(" - ")

                          return (
                            <Table.Tr key={contractAmountPeriodDates[0]?.getTime()}>
                              <Table.Td>{period}</Table.Td>
                              <Table.Td>{`${form.values.rentAmount} ${
                                i === 0 ? "- Monto inicial" : `* IPC Periodo ${i}`
                              }`}</Table.Td>
                            </Table.Tr>
                          )
                        })}
                      </Table.Tbody>
                    </Table>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            )}

            <Text>Comisión</Text>
            <Flex direction="row" gap="md">
              <Select
                label="Tipo"
                data={[
                  { value: ContractFeeType.PERCENTAGE, label: "Porcentaje" },
                  { value: ContractFeeType.FIXED, label: "Fijo" },
                ]}
                {...form.getInputProps("feeType")}
              />
              <NumberInput
                label="Valor"
                min={0}
                hideControls
                allowNegative={false}
                {...form.getInputProps("fee")}
                {...(form.values.feeType === ContractFeeType.PERCENTAGE
                  ? {
                      suffix: "%",
                      max: 100,
                    }
                  : {
                      prefix: "$",
                    })}
              />
            </Flex>
          </Flex>
        )
      }}
    </Form>
  )
}
