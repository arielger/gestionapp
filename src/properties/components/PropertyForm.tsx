import React from "react"
import { Flex, ComboboxItem } from "@mantine/core"
import { z } from "src/core/zod"

import Form, { FormProps } from "src/core/components/Form"
import { ClientsSelect } from "src/clients/components/ClientsSelect"
// import { AddressSearchInput } from "src/core/components/AddressSearchInput"
import { AddressFormFields } from "src/core/components/AddressFormFields"

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
    <Form initialValues={mappedInitialValues} {...props}>
      {(form) => {
        return (
          <Flex direction="column" gap="sm">
            <ClientsSelect
              label="Propietario/s"
              initialValues={ownersInitialValues}
              {...form.getInputProps("owners")}
            />
            {/* TODO: Review how to add google maps integration */}
            {/* <AddressSearchInput
                textInputProps={{
                  label: "Dirección",
                  placeholder: "Buscar dirección",
                }}
                form={form}
              /> */}
            <AddressFormFields form={form} />
          </Flex>
        )
      }}
    </Form>
  )
}
