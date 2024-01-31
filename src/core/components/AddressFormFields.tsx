import { Flex, TextInput, NumberInput } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"

export const AddressFormFields = ({ form }: { form: UseFormReturnType<unknown> }) => {
  return (
    <>
      <Flex gap="md">
        <TextInput
          style={{ flex: 2 }}
          label="Calle/Avenida"
          {...form.getInputProps("address.street")}
        />
        <NumberInput
          style={{ flex: 1 }}
          label="Número"
          allowNegative={false}
          hideControls
          {...form.getInputProps("address.streetNumber")}
        />
        <TextInput
          style={{ flex: 1 }}
          label="Piso/departamento"
          {...form.getInputProps("address.subpremise")}
        />
      </Flex>
      <Flex gap="md">
        <TextInput style={{ flex: 1 }} label="Provincia" {...form.getInputProps("address.state")} />
        <TextInput style={{ flex: 1 }} label="Barrio" {...form.getInputProps("address.city")} />
      </Flex>
      <TextInput label="Código Postal" {...form.getInputProps("address.postalCode")} />
    </>
  )
}
