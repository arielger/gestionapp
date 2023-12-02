import React, { useState } from "react"
import { Flex, Select, Button, TextInput } from "@mantine/core"
import { Prisma } from "@prisma/client"
import { DataTable } from "mantine-datatable"
import { useQuery } from "@blitzjs/rpc"
import uniqBy from "lodash/uniqBy"

import Form from "src/core/components/Form"
import getRealStateOwners from "src/real-state-owners/queries/getRealStateOwners"
import { getPersonFullName } from "src/real-state-owners/utils"

type RealStateOwnerWithRelatedEntities = Prisma.RealStateOwnerGetPayload<{
  include: {
    contracts: {
      include: {
        owners: true
        property: true
        tenants: true
      }
    }
  }
}>

export type ContractWithRelatedEntities = Prisma.ContractGetPayload<{
  include: {
    owners: true
    property: true
    tenants: true
  }
}>

export function ContractSearchForm({
  onSelectContract,
}: {
  onSelectContract: (contract: ContractWithRelatedEntities) => void
}) {
  // TODO: Improve search to search for first and last name at the same time
  const [searchText, setSearchText] = useState("")

  const [ownersData, { isFetching: isFetchingOwners, refetch: refetchOwners }] = useQuery(
    getRealStateOwners,
    {
      where: {
        OR: [
          { firstName: { contains: searchText, mode: "insensitive" } },
          { lastName: { contains: searchText, mode: "insensitive" } },
        ],
      },
      include: {
        contracts: {
          include: {
            owners: true,
            property: true,
            tenants: true,
          },
        },
      },
    },
    {
      enabled: false,
      suspense: false,
      keepPreviousData: true,
    }
  )

  const isSearching = isFetchingOwners
  const searchedContracts = ownersData?.items
    ? uniqBy(
        ownersData.items
          ?.map((owner) =>
            (owner as RealStateOwnerWithRelatedEntities).contracts.map((contract) => ({
              contract,
              address: contract.property.address,
              owners: contract.owners.map((owner) => getPersonFullName(owner)).join(", "),
              tenants: contract.tenants.map((owner) => getPersonFullName(owner)).join(", "),
            }))
          )
          .flat(),
        "contract.id"
      )
    : undefined

  return (
    <>
      <Form
        initialValues={{
          searchBy: "Propietario",
        }}
        onSubmit={() => refetchOwners({})}
      >
        {(form) => {
          return (
            <Flex direction="column" gap="sm">
              <Flex direction="row" gap="md">
                <Select
                  label="Buscar contrato por"
                  data={[
                    { value: "Propietario", label: "Propietario" },
                    { value: "Inquilino", label: "Inquilino", disabled: true },
                    { value: "Dirección", label: "Dirección", disabled: true },
                  ]}
                  {...form.getInputProps("searchBy")}
                />
                <TextInput
                  label={`${form.values.searchBy} a buscar`}
                  {...form.getInputProps("searchText")}
                  onChange={(e) => {
                    form.getInputProps("searchText").onChange(e.currentTarget.value)
                    setSearchText(e.currentTarget.value)
                  }}
                />
                <Button sx={{ alignSelf: "end" }} type="submit" loading={isSearching}>
                  Buscar
                </Button>
              </Flex>
              <DataTable
                idAccessor={(row) => row.contract.id}
                minHeight={!searchedContracts?.length ? 200 : undefined}
                noRecordsText="No se encontraron contratos relacionados a la búsqueda"
                fetching={isSearching}
                withBorder
                withColumnBorders
                records={searchedContracts}
                columns={[
                  { accessor: "contract.id", title: "ID contrato" },
                  { accessor: "address", title: "Dirección" },
                  { accessor: "owners", title: "Propietario/s" },
                  { accessor: "tenants", title: "Inquilino/s" },
                  {
                    accessor: "actions",
                    title: "",
                    render: (row) => (
                      <Button
                        size="xs"
                        variant="light"
                        onClick={() => onSelectContract(row.contract)}
                      >
                        Seleccionar
                      </Button>
                    ),
                  },
                ]}
              />
            </Flex>
          )
        }}
      </Form>
    </>
  )
}
