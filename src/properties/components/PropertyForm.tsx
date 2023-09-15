import { useForm, zodResolver } from "@mantine/form"
import React, { Suspense } from "react"
import { Button, TextInput } from "@mantine/core"

import { z } from "zod"
import Form, { FormProps } from "src/core/components/Form"

export function PropertyForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <>
      <Form {...props}>
        {(form) => <TextInput label="Dirección" {...form.getInputProps("address")} required />}
      </Form>
    </>
  )
}
