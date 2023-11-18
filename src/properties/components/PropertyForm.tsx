import React, { useState } from "react"
import { useQuery } from "@blitzjs/rpc"
import { Flex, SelectItem, TextInput } from "@mantine/core"
import { MultiSelect } from "@mantine/core"
import { useThrottle } from "@react-hook/throttle"

import getRealStateOwners from "src/real-state-owners/queries/getRealStateOwners"
import { z } from "zod"
import Form, { FormProps } from "src/core/components/Form"
import { personToSelectItem } from "src/real-state-owners/utils"

export function PropertyForm<S extends z.ZodType<any, any>>({
  initialValues,
  // Value used to initialize the labels for owners (when editing)
  ownersInitialValues = [],
  ...props
}: FormProps<S> & {
  ownersInitialValues?: SelectItem[]
}) {
  const [ownersSearchTextDebounced, setOwnersSearchTextDebounced] = useThrottle("", 0.5)
  const [selectedOwners, setSelectedOwners] = useState<SelectItem[]>([])

  const [owners] = useQuery(
    getRealStateOwners,
    {
      where: {
        OR: [
          { firstName: { contains: ownersSearchTextDebounced, mode: "insensitive" } },
          { lastName: { contains: ownersSearchTextDebounced, mode: "insensitive" } },
        ],
      },
    },
    {
      suspense: false,
      keepPreviousData: true,
    }
  )

  const ownersList = [
    ...ownersInitialValues,
    ...selectedOwners,
    ...(owners?.items.map(personToSelectItem) ?? []),
  ]
  const filteredOwnersList = ownersList.filter(
    (owner, index) => ownersList.findIndex((o) => o.value === owner.value) === index
  )

  const mappedInitialValues = {
    ...initialValues,
    owners: initialValues?.owners?.map((ownerId) => String(ownerId)),
  }

  return (
    <>
      <Form initialValues={mappedInitialValues} {...props}>
        {(form) => {
          return (
            <Flex direction="column" gap="sm">
              <TextInput label="Dirección" {...form.getInputProps("address")} required />
              <MultiSelect
                label="Propietario"
                data={filteredOwnersList}
                maxSelectedValues={5}
                searchable
                onSearchChange={(searchText) => {
                  setOwnersSearchTextDebounced(searchText)
                }}
                nothingFound="No se encontraron resultados"
                {...form.getInputProps("owners")}
                onChange={(values) => {
                  setSelectedOwners(
                    values.map((value) => ({
                      value,
                      label: ownersList.find((owner) => owner.value === value)!.label,
                    }))
                  )
                  form.getInputProps("owners").onChange(values)
                }}
              />
            </Flex>
          )
        }}
      </Form>
    </>
  )
}
