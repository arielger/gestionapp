import { Flex, NativeSelect, Checkbox, NumberInput, TextInput } from "@mantine/core"
import { ActivityPersonType, ActivityType } from "@prisma/client"
import React from "react"
import { Form, FormProps } from "src/core/components/Form"

import { z } from "zod"
import { activityPersonLabels, activityTypesLabels } from "../config"

export function ActivityForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      {(form) => {
        return (
          <Flex direction="column" gap="sm">
            <NumberInput label="Monto" {...form.getInputProps("amount")} />
            <Checkbox label="Debito" {...form.getInputProps("isDebit")} />
            <NativeSelect
              label="Tipo"
              data={Object.values(ActivityType).map((activityType) => ({
                value: activityType,
                label: activityTypesLabels[activityType],
              }))}
              {...form.getInputProps("type")}
            />
            <NativeSelect
              label="Asignar al"
              data={Object.values(ActivityPersonType).map((activityPersonType) => ({
                value: activityPersonType,
                label: activityPersonLabels[activityPersonType],
              }))}
              {...form.getInputProps("assignedTo")}
            />
            {form.values.type === ActivityType.CUSTOM && (
              <>
                <TextInput label="Titulo" {...form.getInputProps("details.title")} />
              </>
            )}
          </Flex>
        )
      }}
    </Form>
  )
}
