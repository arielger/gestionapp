import React from "react"
import { Flex, NumberInput } from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import { z } from "zod"

import { Form, FormProps } from "src/core/components/Form"
import { RealStateOwnerSelect } from "src/real-state-owners/components/RealStateOwnerSelect"
import { TenantSelect } from "src/tenants/components/TenantSelect"

export function ContractForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      {(form) => {
        return (
          <Flex direction="column" gap="sm">
            {/* TODO: review -> values not initializing properly */}
            {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
            <RealStateOwnerSelect
              // TODO: Add initial values for edit
              initialValues={[]}
              {...form.getInputProps("owners")}
            />
            <TenantSelect
              // TODO: Add initial values for edit
              initialValues={[]}
              {...form.getInputProps("tenants")}
            />
            <Flex direction="row" gap="md">
              <DatePickerInput
                sx={{ flex: 1 }}
                label="Inicio"
                popoverProps={{ withinPortal: true }}
                {...form.getInputProps("startDate")}
              />
              <DatePickerInput
                sx={{ flex: 1 }}
                label="Fin"
                popoverProps={{ withinPortal: true }}
                {...form.getInputProps("endDate")}
              />
            </Flex>
            <NumberInput label="Periodos (mensual)" {...form.getInputProps("periods")} />
            <NumberInput label="Monto" {...form.getInputProps("rentAmount")} />
          </Flex>
        )
      }}
    </Form>
  )
}
