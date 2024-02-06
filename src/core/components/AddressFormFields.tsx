import { Flex, TextInput, NumberInput, Fieldset } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"

export const AddressFormFields = ({ form }: { form: UseFormReturnType<unknown> }) => {
  return (
    <Fieldset legend="Dirección">
      <Flex gap="md">
        <TextInput
          withAsterisk
          style={{ flex: 2 }}
          label="Calle/Avenida"
          {...form.getInputProps("address.street")}
        />
        <NumberInput
          withAsterisk
          style={{ flex: 1 }}
          label="Número"
          allowNegative={false}
          hideControls
          {...form.getInputProps("address.streetNumber")}
        />
        <TextInput
          style={{ flex: 1 }}
          label="Piso/dpto"
          {...form.getInputProps("address.subpremise")}
        />
      </Flex>
      <Flex gap="md">
        <TextInput
          withAsterisk
          style={{ flex: 1 }}
          label="Provincia"
          {...form.getInputProps("address.state")}
        />
        <TextInput
          withAsterisk
          style={{ flex: 1 }}
          label="Barrio"
          {...form.getInputProps("address.city")}
        />
      </Flex>
      <TextInput label="Código Postal" {...form.getInputProps("address.postalCode")} />
    </Fieldset>
  )
}
