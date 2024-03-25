import React, { useState } from "react"
import { Flex, Select, Button, TextInput } from "@mantine/core"
import { useQuery } from "@blitzjs/rpc"

import Form from "src/core/components/Form"
import { DataTable } from "src/core/components/DataTable"
import getContracts, { ContractWithRelatedEntities } from "src/contracts/queries/getContracts"
import { PersonList } from "src/clients/components/PersonList"
import { getAddressString } from "src/addresses/utils"
import { GetContractsSearchBy } from "src/contracts/types"

const selectSearchTypeValues = [
  { value: GetContractsSearchBy.OWNERS, label: "Propietario" },
  { value: GetContractsSearchBy.TENANTS, label: "Inquilino" },
  { value: GetContractsSearchBy.ADDRESS, label: "Dirección" },
]

const initialFormData = {
  searchBy: GetContractsSearchBy.OWNERS,
  searchText: "",
}

export function ContractSearchForm({
  onSelectContract,
}: {
  onSelectContract: (contract: ContractWithRelatedEntities) => void
}) {
  const [formValues, setFormValues] = useState<{
    searchBy: (typeof selectSearchTypeValues)[number]["value"]
    searchText: string
  }>(initialFormData)

  const [contractsData, { isFetching: isFetchingContracts, refetch: refetchContracts }] = useQuery(
    getContracts,
    {
      // TODO: add full name search
      searchText: formValues.searchText,
      searchBy: formValues.searchBy,
    },
    {
      enabled: false,
      suspense: false,
      keepPreviousData: true,
    }
  )

  const isSearching = isFetchingContracts

  return (
    <>
      <Form
        initialValues={initialFormData}
        onSubmit={() => refetchContracts({})}
        formHookProps={{
          onValuesChange: (values) => {
            setFormValues(values)
          },
        }}
      >
        {(form) => {
          return (
            <Flex direction="column" gap="sm">
              <Flex direction="row" gap="md">
                <Select
                  allowDeselect={false}
                  label="Buscar contrato por"
                  data={selectSearchTypeValues}
                  {...form.getInputProps("searchBy")}
                />
                <TextInput
                  label={`${
                    selectSearchTypeValues.find(
                      (searchType) => searchType.value === form.values.searchBy
                    )?.label
                  } a buscar`}
                  {...form.getInputProps("searchText")}
                />
                <Button style={{ alignSelf: "end" }} type="submit" loading={isSearching}>
                  Buscar
                </Button>
              </Flex>
              <DataTable
                idAccessor={(row) => row.id}
                noRecordsText="No se encontraron contratos relacionados a la búsqueda"
                fetching={isSearching}
                withColumnBorders
                records={contractsData?.items}
                columns={[
                  { accessor: "id", title: "ID contrato" },
                  {
                    accessor: "property.address",
                    title: "Dirección",
                    render: (row) =>
                      getAddressString({
                        address: row.property.address,
                      }),
                  },
                  {
                    accessor: "owners",
                    title: "Propietario/s",
                    render: (row) => <PersonList list={row.owners.map((owner) => owner.client)} />,
                  },
                  {
                    accessor: "tenants",
                    title: "Inquilino/s",
                    render: (row) => (
                      <PersonList list={row.tenants.map((tenant) => tenant.client)} />
                    ),
                  },
                  {
                    accessor: "actions",
                    title: "",
                    render: (row) => (
                      <Button size="xs" variant="light" onClick={() => onSelectContract(row)}>
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
