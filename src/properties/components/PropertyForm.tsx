import React from "react"
import { useQuery } from "@blitzjs/rpc"
import { TextInput } from "@mantine/core"
import { MultiSelect } from "@mantine/core"

import getRealStateOwners from "src/real-state-owners/queries/getRealStateOwners"
import { z } from "zod"
import Form, { FormProps } from "src/core/components/Form"

export function PropertyForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const [owners] = useQuery(getRealStateOwners, {})

  const ownersList = owners?.items.map((owner) => ({
    value: owner.id,
    label: `${owner.firstName} ${owner.lastName}`,
  }))

  return (
    <>
      <Form {...props}>
        {(form) => (
          <>
            <TextInput label="Dirección" {...form.getInputProps("address")} required />
            <MultiSelect
              label="Propietario"
              data={ownersList}
              maxSelectedValues={5}
              {...form.getInputProps("owners")}
            />
          </>
        )}
      </Form>
    </>
  )
}
