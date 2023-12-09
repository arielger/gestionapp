import React from "react"
import { Accordion, Flex, NumberInput, Select, Table, Text } from "@mantine/core"
import { DateInput } from "@mantine/dates"
import { z } from "zod"

import { Form, FormProps } from "src/core/components/Form"
import { RealStateOwnerSelect } from "src/real-state-owners/components/RealStateOwnerSelect"
import { TenantSelect } from "src/tenants/components/TenantSelect"
import { getContractRentPaymentDates } from "../utils/utils"
import { ContractFeeType } from "@prisma/client"

export function ContractForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S>
      initialValues={{
        feeType: ContractFeeType.PERCENTAGE,
        fee: 0.1,
      }}
      {...props}
    >
      {(form) => {
        return (
          <Flex direction="column" gap="sm">
            {/* TODO: review -> values not initializing properly */}
            {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
            <RealStateOwnerSelect
              // TODO: Add initial values for create (based on property data)
              initialValues={[]}
              {...form.getInputProps("owners")}
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
                // TODO: Format as percentage
                {...form.getInputProps("fee")}
                {...(form.values.feeType === ContractFeeType.PERCENTAGE
                  ? {
                      suffix: "%",
                      max: 1,
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
