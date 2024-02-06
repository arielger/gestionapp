import { Flex, TextInput } from "@mantine/core"
import React from "react"
import { AddressFormFields } from "src/core/components/AddressFormFields"
import { Form, FormProps } from "src/core/components/Form"

import { z } from "zod"

export function ClientForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      {(form) => (
        <Flex direction="column" gap="sm">
          <Flex gap="md">
            <TextInput
              withAsterisk
              style={{ flex: 1 }}
              label="Nombre"
              {...form.getInputProps("firstName")}
            />
            <TextInput
              withAsterisk
              style={{ flex: 1 }}
              label="Apellido"
              {...form.getInputProps("lastName")}
            />
          </Flex>
          <TextInput label="Email" {...form.getInputProps("email")} />
          <AddressFormFields form={form} />
        </Flex>
      )}
    </Form>
  )
}
