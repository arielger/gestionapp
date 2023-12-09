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
import { z } from "zod"

import { Form, FormProps } from "src/core/components/Form"
import { RealStateOwnerSelect } from "src/real-state-owners/components/RealStateOwnerSelect"
import { TenantSelect } from "src/tenants/components/TenantSelect"
import { getContractRentPaymentDates } from "../utils/utils"
import { ContractFeeType } from "@prisma/client"

export function ContractForm<S extends z.ZodType<any, any>>({
  ownersInitialValue = [],
  ...props
}: FormProps<S> & { ownersInitialValue?: ComboboxItem[] }) {
  return (
    <Form<S>
      initialValues={{
        feeType: ContractFeeType.PERCENTAGE,
        fee: 10,
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
            <TenantSelect initialValues={[]} {...form.getInputProps("tenants")} />
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
            <NumberInput label="Monto" hideControls {...form.getInputProps("rentAmount")} />

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

            {!!form.values.startDate && !!form.values.startDate && !!form.values.rentAmount && (
              <Accordion defaultValue="rent" variant="contained">
                <Accordion.Item value="rent">
                  <Accordion.Control>Detalles cobro mensual</Accordion.Control>
                  <Accordion.Panel>
                    <Table>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Fecha</Table.Th>
                          <Table.Th>Monto</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {getContractRentPaymentDates(
                          form.values.startDate,
                          form.values.endDate
                        ).map((date) => (
                          <Table.Tr key={date.toLocaleDateString()}>
                            <Table.Td>{date.toLocaleDateString()}</Table.Td>
                            <Table.Td>{form.values.rentAmount}</Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            )}
          </Flex>
        )
      }}
    </Form>
  )
}
