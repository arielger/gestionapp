import {
  Flex,
  NativeSelect,
  NumberInput,
  TextInput,
  SegmentedControl,
  Input,
  Center,
  Box,
} from "@mantine/core"
import { ActivityPersonType, ActivityType } from "@prisma/client"
import { IconTransferIn, IconTransferOut } from "@tabler/icons-react"
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
                  {
                    label: (
                      <Center c="red">
                        <IconTransferOut size="1rem" />
                        <Box ml={10}>Debito</Box>
                      </Center>
                    ),
                    value: ActivityTransactionType.DEBIT,
                  },
                  {
                    label: (
                      <Center c="teal">
                        <IconTransferIn size="1rem" />
                        <Box ml={10}>Credito</Box>
                      </Center>
                    ),
                    value: ActivityTransactionType.CREDIT,
                  },
                ]}
                {...form.getInputProps("transactionType")}
              />
            </Input.Wrapper>
            <Input.Wrapper label="Asignar al">
              <SegmentedControl
                fullWidth
                data={[ActivityPersonType.TENANT, ActivityPersonType.OWNER].map(
                  (activityPersonType) => ({
                    value: activityPersonType,
                    label: activityPersonLabels[activityPersonType],
                  })
                )}
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
