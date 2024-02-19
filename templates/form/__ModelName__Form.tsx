import React from "react"
import { Form, FormProps } from "src/core/components/Form"

import { z } from "src/core/zod"

export function __ModelName__Form<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      {(form) => (
        <>
          {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
        </>
      )}
    </Form>
  )
}
