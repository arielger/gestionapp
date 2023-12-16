import React from "react"
import { Flex, ComboboxItem, TextInput } from "@mantine/core"
import { z } from "zod"

import Form, { FormProps } from "src/core/components/Form"
import { RealStateOwnerSelect } from "src/real-state-owners/components/RealStateOwnerSelect"

export function PropertyForm<S extends z.ZodType<any, any>>({
  initialValues,
  // Value used to initialize the labels for owners (when editing)
  ownersInitialValues = [],
  ...props
}: FormProps<S> & {
  ownersInitialValues?: ComboboxItem[]
}) {
  const mappedInitialValues = {
    ...initialValues,
    owners: initialValues?.owners?.map((ownerId) => String(ownerId)),
  }

  return (
    <>
      <Form initialValues={mappedInitialValues} {...props}>
        {(form) => {
          return (
            <Flex direction="column" gap="sm">
              <TextInput label="Dirección" {...form.getInputProps("address")} required />
              <RealStateOwnerSelect
                initialValues={ownersInitialValues}
                {...form.getInputProps("owners")}
              />
            </Flex>
          )
        }}
      </Form>
    </>
  )
}
