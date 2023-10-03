import React from "react"
import { MultiSelect } from "@mantine/core"
import { useQuery } from "@blitzjs/rpc"
import { z } from "zod"

import { Form, FormProps } from "src/core/components/Form"
import getTenants from "src/tenants/queries/getTenants"
import getRealStateOwners from "src/real-state-owners/queries/getRealStateOwners"

export function ContractForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const [tenants] = useQuery(getTenants, {})
  const [owners] = useQuery(getRealStateOwners, {})

  const tenantsList = tenants?.items.map((tenant) => ({
    value: String(tenant.id),
    label: `${tenant.firstName} ${tenant.lastName}`,
  }))

  const ownersList = owners?.items.map((owner) => ({
    value: String(owner.id),
    label: `${owner.firstName} ${owner.lastName}`,
  }))

  return (
    <Form<S> {...props}>
      {(form) => {
        return (
          <>
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
          </>
        )
      }}
    </Form>
  )
}
