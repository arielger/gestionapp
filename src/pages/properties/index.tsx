import React, { useState } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useMutation } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import { ActionIcon, Button, Badge, TextInput, Group } from "@mantine/core"
import { IconEdit, IconTrash, IconEye, IconCheck, IconSearch } from "@tabler/icons-react"

import { DataTable, actionsColumnConfig } from "src/core/components/DataTable"
import Layout from "src/core/layouts/Layout"
import getProperties from "src/properties/queries/getProperties"
import deleteProperty from "src/properties/mutations/deleteProperty"
import { usePaginatedTable } from "src/core/hooks/usePaginatedTable"
import { PageHeader } from "src/layout/components/PageHeader"
import { PersonList } from "src/real-state-owners/components/PersonList"

export const PropertiesList = () => {
  const router = useRouter()

  const [filters, setFilters] = useState({
    address: "",
  })

  const { tableProps, items } = usePaginatedTable({
    query: getProperties,
    queryParams: {
      where: {
        ...(filters.address
          ? {
              address: {
                contains: filters.address,
                mode: "insensitive",
              },
            }
          : {}),
      },
    },
  })

  const [deletePropertyMutation] = useMutation(deleteProperty)

  const handleDelete = async (property: (typeof items)[number]) => {
    await deletePropertyMutation({ id: property.id })
    await router.push(Routes.PropertiesPage())
  }

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
            filter: (
              <TextInput
                label="Dirección"
                description="Mostrar propiedades cuya dirección incluya el siguiente texto:"
                placeholder="Buscar propiedades..."
                leftSection={<IconSearch size={16} />}
                value={filters.address}
                onChange={(e) =>
                  setFilters((filters) => ({
                    ...filters,
                    address: e.currentTarget.value,
                  }))
                }
              />
            ),
            filtering: filters.address !== "",
          },
          {
            accessor: "owners",
            title: "Propietario/s",
            render: (property) => (
              <PersonList
                list={property?.owners ?? []}
                handlePress={(id) => Routes.ShowRealStateOwnerPage({ realStateOwnerId: id })}
              />
            ),
          },
          {
            accessor: "contract",
            title: "Estado",
            render: (property) =>
              property?.Contract?.length > 0 ? (
                <Badge
                  leftSection={<IconCheck style={{ width: 10, height: 10 }} />}
                  variant="light"
                  color="green"
                  radius="xs"
                >
                  Alquilada
                </Badge>
              ) : (
                <Badge opacity={0.5} variant="light" color="gray" radius="xs">
                  No alquilada
                </Badge>
              ),
          },
          {
            ...actionsColumnConfig,
            render: (property) => (
              <Group gap={4} justify="right" wrap="nowrap">
                <Link href={Routes.ShowPropertyPage({ propertyId: property.id })}>
                  <ActionIcon size="sm" variant="subtle">
                    <IconEye size="1rem" stroke={1.5} />
                  </ActionIcon>
                </Link>
                <Link href={Routes.EditPropertyPage({ propertyId: property.id })}>
                  <ActionIcon size="sm" variant="subtle">
                    <IconEdit size="1rem" stroke={1.5} />
                  </ActionIcon>
                </Link>
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  color="red"
                  onClick={() => handleDelete(property)}
                >
                  <IconTrash size="1rem" stroke={1.5} />
                </ActionIcon>
              </Group>
            ),
          },
        ]}
        {...tableProps}
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

export default PropertiesPage
