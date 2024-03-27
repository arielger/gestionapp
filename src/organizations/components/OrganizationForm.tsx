import { Flex, TextInput } from "@mantine/core"
import React from "react"
import { Form, FormProps } from "src/core/components/Form"
import { z } from "src/core/zod"

export function OrganizationForm<S extends z.ZodType>(props: FormProps<S>) {
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
                {...form.getInputProps("name")}
              />
            </Flex>
          </Flex>
        )
      }}
    </Form>
  )
}
