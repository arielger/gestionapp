import { Flex, NumberInput, Text, TextInput } from "@mantine/core"
import React from "react"
import { AddressFormFields } from "src/core/components/AddressFormFields"
import { Form, FormProps } from "src/core/components/Form"

import { z } from "src/core/zod"

export function ClientForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      {(form) => {
        return (
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
            <NumberInput
              label="DNI"
              {...form.getInputProps("identityDocNumber")}
              allowNegative={false}
              allowDecimal={false}
              hideControls
            />
            <TextInput
              label="Teléfono (código de área + número)"
              leftSection={<Text size="sm">+54</Text>}
              {...form.getInputProps("phoneNumber")}
            />
            <AddressFormFields form={form} />
          </Flex>
        )
      }}
    </Form>
  )
}
