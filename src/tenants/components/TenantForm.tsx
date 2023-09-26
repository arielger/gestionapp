import { TextInput } from "@mantine/core"
import React, { Suspense } from "react"
import { Form, FormProps } from "src/core/components/Form"

import { z } from "zod"

export function TenantForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      {(form) => (
        <>
          <TextInput label="Nombre" {...form.getInputProps("firstName")} />
          <TextInput label="Apellido" {...form.getInputProps("lastName")} />
        </>
      )}
    </Form>
  )
}
