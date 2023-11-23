import { useQuery } from "@blitzjs/rpc"
import { Loader, MultiSelect, SelectItem } from "@mantine/core"
import getTenants from "../queries/getTenants"
import { useThrottle } from "@react-hook/throttle"
import { useState } from "react"
import { personToSelectItem } from "src/real-state-owners/utils"

export const TenantSelect = ({
  initialValues,
  onChange,
  ...props
}: {
  initialValues: SelectItem[]
  onChange: (values: string[]) => void
}) => {
  const [selectedTenants, setSelectedTenants] = useState<SelectItem[]>([])
  const [searchTextDebounced, setSearchTextDebounced] = useThrottle("", 0.5)

  // TODO: Improve search to search for first and last name at the same time
  const [tenants, { isFetching }] = useQuery(
    getTenants,
    {
      where: {
        OR: [
          { firstName: { contains: searchTextDebounced, mode: "insensitive" } },
          { lastName: { contains: searchTextDebounced, mode: "insensitive" } },
        ],
      },
    },
    {
      suspense: false,
      keepPreviousData: true,
    }
  )

  const tenantsList = [
    ...initialValues,
    ...selectedTenants,
    ...(tenants?.items.map(personToSelectItem) ?? []),
  ]
  // remove duplicated items
  const filteredtenantsList = tenantsList.filter(
    (tenant, index) => tenantsList.findIndex((o) => o.value === tenant.value) === index
  )

  return (
    <MultiSelect
      label="Inquilino/s"
      data={filteredtenantsList}
      maxSelectedValues={5}
      searchable
      rightSection={isFetching ? <Loader size={14} /> : undefined}
      onSearchChange={(searchText) => {
        setSearchTextDebounced(searchText)
      }}
      nothingFound="No se encontraron resultados"
      {...props}
      onChange={(values) => {
        setSelectedTenants(
          values.map((value) => ({
            value,
            label: tenantsList.find((tenant) => tenant.value === value)!.label,
          }))
        )
        onChange(values)
      }}
    />
  )
}
