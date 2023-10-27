import React from "react"
import { Flex, MultiSelect, NumberInput } from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import { useQuery } from "@blitzjs/rpc"
import { z } from "zod"

import { Form, FormProps } from "src/core/components/Form"
import getTenants from "src/tenants/queries/getTenants"
import getRealStateOwners from "src/real-state-owners/queries/getRealStateOwners"
import { personToSelectItem } from "src/real-state-owners/utils"

export function ContractForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const [tenants] = useQuery(getTenants, {})
  const [owners] = useQuery(getRealStateOwners, {})

  const tenantsList = tenants?.items.map(personToSelectItem)
  const ownersList = owners?.items.map(personToSelectItem)

  return (
    <Form<S> {...props}>
      {(form) => {
        return (
          <Flex direction="column" gap="sm">
            {/* TODO: review -> values not initializing properly */}
            {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
            <MultiSelect
              label="Propietario"
              data={ownersList}
              maxSelectedValues={5}
              {...form.getInputProps("owners")}
            />
            <MultiSelect
              label="Inquilino"
              data={tenantsList}
              maxSelectedValues={5}
              {...form.getInputProps("tenants")}
            />
            <DatePickerInput label="Inicio" {...form.getInputProps("startDate")} />
            <DatePickerInput label="Fin" {...form.getInputProps("endDate")} />
            <NumberInput label="Periodos" {...form.getInputProps("periods")} />
            <NumberInput label="Monto" {...form.getInputProps("rentAmount")} />
          </Flex>
        )
      }}
    </Form>
  )
}
