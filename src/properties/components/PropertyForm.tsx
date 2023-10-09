import React, { useState } from "react"
import { useQuery } from "@blitzjs/rpc"
import { Flex, TextInput } from "@mantine/core"
import { MultiSelect } from "@mantine/core"
import { useThrottle } from "@react-hook/throttle"

import getRealStateOwners from "src/real-state-owners/queries/getRealStateOwners"
import { z } from "zod"
import Form, { FormProps } from "src/core/components/Form"

export function PropertyForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const [ownersSearchTextDebounced, setOwnersSearchTextDebounced] = useThrottle("", 0.5)
  const [selectedOwners, setSelectedOwners] = useState<
    {
      value: string
      label: string
    }[]
  >([])

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
    ...selectedOwners,
    ...(owners?.items.map((owner) => ({
      value: String(owner.id),
      label: `${owner.firstName} ${owner.lastName}`,
    })) ?? []),
  ]
  const filteredOwnersList = ownersList.filter(
    (owner, index) => ownersList.findIndex((o) => o.value === owner.value) === index
  )

  return (
    <>
      <Form {...props}>
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
