import React from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { ActionIcon, Button, Badge, Group } from "@mantine/core"
import { IconEdit, IconTrash, IconEye } from "@tabler/icons-react"

import { DataTable, actionsColumnConfig } from "src/core/components/DataTable"
import Layout from "src/core/layouts/Layout"
import getProperties from "src/properties/queries/getProperties"
import { usePaginatedTable } from "src/core/hooks/usePaginatedTable"
import { PageHeader } from "src/layout/components/PageHeader"
import { PersonList } from "src/clients/components/PersonList"
import { ContractProgress } from "src/contracts/components/ContractProgress"
import { getCurrentContract } from "src/contracts/utils/utils"
import { getAddressString } from "src/addresses/utils"
import { usePropertyDelete } from "src/properties/hooks"

export const PropertiesList = () => {
  // const [filters, setFilters] = useState({
  //   address: "",
  // })

  const {
    tableProps,
    items,
    refetch: refetchProperties,
  } = usePaginatedTable({
    query: getProperties,
  })

  const propertiesWithCurrentContract = items.map((property) => {
    return {
      ...property,
      currentContract: getCurrentContract(property.contracts),
    }
  })

  const { isLoadingDelete, deleteMutationVariables, deleteProperty } = usePropertyDelete({
    onSuccess: refetchProperties,
  })

  const actionsDisabled = isLoadingDelete

  return (
    <>
      <DataTable
        columns={[
          {
            accessor: "id",
            title: "#",
            textAlign: "right",
            width: 60,
          },
          {
            accessor: "address",
            title: "Dirección",
            render: (property) =>
              getAddressString({
                address: property.address,
              }),
            // TODO: add filtering with new address fields
            // filter: (
            //   <TextInput
            //     label="Dirección"
            //     description="Mostrar propiedades cuya dirección incluya el siguiente texto:"
            //     placeholder="Buscar propiedades..."
            //     leftSection={<IconSearch size={16} />}
            //     value={filters.address}
            //     onChange={(e) =>
            //       setFilters((filters) => ({
            //         ...filters,
            //         address: e.currentTarget.value,
            //       }))
            //     }
            //   />
            // ),
            // filtering: filters.address !== "",
          },
          {
            accessor: "owners",
            title: "Propietario/s",
            render: (property) => (
              <PersonList list={property?.owners.map((owner) => owner.client) ?? []} />
            ),
          },
          {
            accessor: "currentContract",
            title: "Estado",
            width: 240,
            render: (property) => {
              if (!property.currentContract)
                return (
                  <Badge opacity={0.5} variant="light" color="gray" radius="xs">
                    No alquilada
                  </Badge>
                )

              return <ContractProgress contract={property.currentContract} />
            },
          },
          {
            accessor: "currentContract.tenants",
            title: "Inquilino/s",
            render: (property) => (
              <PersonList
                list={property?.currentContract?.tenants.map((tenant) => tenant.client) ?? []}
              />
            ),
          },
          {
            ...actionsColumnConfig,
            render: (property) => (
              <Group gap={4} justify="right" wrap="nowrap">
                <Link href={Routes.ShowPropertyPage({ propertyId: property.id })}>
                  <ActionIcon disabled={actionsDisabled} size="sm" variant="subtle">
                    <IconEye size="1rem" stroke={1.5} />
                  </ActionIcon>
                </Link>
                <Link href={Routes.EditPropertyPage({ propertyId: property.id })}>
                  <ActionIcon disabled={actionsDisabled} size="sm" variant="subtle">
                    <IconEdit size="1rem" stroke={1.5} />
                  </ActionIcon>
                </Link>
                <ActionIcon
                  disabled={actionsDisabled}
                  loading={
                    isLoadingDelete &&
                    (deleteMutationVariables as { id: number })?.id === property.id
                  }
                  size="sm"
                  variant="subtle"
                  color="red"
                  onClick={() => deleteProperty(property.id)}
                >
                  <IconTrash size="1rem" stroke={1.5} />
                </ActionIcon>
              </Group>
            ),
          },
        ]}
        {...tableProps}
        records={propertiesWithCurrentContract}
        noRecordsText="No se encontraron propiedades"
      />
    </>
  )
}

const PropertiesPage = () => {
  return (
    <Layout>
      <Head>
        <title>Propiedades</title>
      </Head>

      <div>
        <PageHeader title="Propiedades">
          <Button variant="filled" component={Link} href={Routes.NewPropertyPage()} size="md">
            Crear
          </Button>
        </PageHeader>
        <PropertiesList />
      </div>
    </Layout>
  )
}

PropertiesPage.authenticate = true

export default PropertiesPage
