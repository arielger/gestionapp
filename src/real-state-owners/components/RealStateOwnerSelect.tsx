import { useQuery } from "@blitzjs/rpc"
import { Loader, MultiSelect, ComboboxItem } from "@mantine/core"
import getRealStateOwners from "../queries/getRealStateOwners"
import { useThrottle } from "@react-hook/throttle"
import { useState } from "react"
import { personToSelectItem } from "../utils"

export const RealStateOwnerSelect = ({
  initialValues,
  onChange,
  ...props
}: {
  initialValues: ComboboxItem[]
  onChange: (values: string[]) => void
}) => {
  const [selectedOwners, setSelectedOwners] = useState<ComboboxItem[]>([])
  const [ownersSearchTextDebounced, setOwnersSearchTextDebounced] = useThrottle("", 0.5)

  // TODO: Improve search to search for first and last name at the same time
  const [owners, { isFetching }] = useQuery(
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
    ...initialValues,
    ...selectedOwners,
    ...(owners?.items.map(personToSelectItem) ?? []),
  ]
  // remove duplicated items
  const filteredOwnersList = ownersList.filter(
    (owner, index) => ownersList.findIndex((o) => o.value === owner.value) === index
  )

  return (
    <MultiSelect
      label="Propietario/s"
      data={filteredOwnersList}
      searchable
      rightSection={isFetching ? <Loader size={14} /> : undefined}
      onSearchChange={(searchText) => {
        setOwnersSearchTextDebounced(searchText)
      }}
      nothingFoundMessage="No se encontraron resultados"
      {...props}
      onChange={(values) => {
        setSelectedOwners(
          values.map((value) => ({
            value,
            label: ownersList.find((owner) => owner.value === value)!.label,
          }))
        )
        onChange(values)
      }}
    />
  )
}
