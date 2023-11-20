import { Flex, NativeSelect, NumberInput, TextInput, SegmentedControl, Input } from "@mantine/core"
import { ActivityPersonType, ActivityType } from "@prisma/client"
import React from "react"
import { Form, FormProps } from "src/core/components/Form"

import { z } from "zod"
import { activityPersonLabels, ActivityTransactionType, activityTypesLabels } from "../config"

export function ActivityForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      {(form) => {
        return (
          <Flex direction="column" gap="sm">
            <NumberInput label="Monto" hideControls {...form.getInputProps("amount")} />
            <Input.Wrapper label="Tipo de transacción">
              <SegmentedControl
                fullWidth
                data={[
                  { label: "Debito", value: ActivityTransactionType.DEBIT },
                  { label: "Credito", value: ActivityTransactionType.CREDIT },
                ]}
                {...form.getInputProps("transactionType")}
              />
            </Input.Wrapper>
            <Input.Wrapper label="Asignar al">
              <SegmentedControl
                fullWidth
                data={Object.values(ActivityPersonType).map((activityPersonType) => ({
                  value: activityPersonType,
                  label: activityPersonLabels[activityPersonType],
                }))}
                {...form.getInputProps("assignedTo")}
              />
            </Input.Wrapper>
            <NativeSelect
              label="Tipo"
              data={Object.values(ActivityType).map((activityType) => ({
                value: activityType,
                label: activityTypesLabels[activityType],
              }))}
              {...form.getInputProps("type")}
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
