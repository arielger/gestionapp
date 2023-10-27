import React from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useMutation } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import { ActionIcon, Anchor, Group, Button, Badge } from "@mantine/core"
import { IconEdit, IconTrash, IconEye, IconCheck } from "@tabler/icons-react"

import { DataTable } from "src/core/components/DataTable"
import Layout from "src/core/layouts/Layout"
import getProperties from "src/properties/queries/getProperties"
import deleteProperty from "src/properties/mutations/deleteProperty"
import { usePaginatedTable } from "src/core/hooks/usePaginatedTable"
import { PageHeader } from "src/layout/components/PageHeader"
import { PersonList } from "src/real-state-owners/components/PersonList"

export const PropertiesList = () => {
  const router = useRouter()

  const { items, page, count, goToPage, recordsPerPage, isLoading } = usePaginatedTable({
    query: getProperties,
  })

  const [deletePropertyMutation] = useMutation(deleteProperty)

  const handleDelete = async (property: (typeof items)[number]) => {
    await deletePropertyMutation({ id: property.id })
    await router.push(Routes.PropertiesPage())
  }

  return (
    <>
      <DataTable
        fetching={isLoading}
        records={items}
        columns={[
          {
            accessor: "id",
            title: "#",
            textAlignment: "right",
            width: 60,
          },
          { accessor: "address", title: "Dirección" },
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
                <Anchor
                  size="sm"
                  component={Link}
                  href={Routes.ShowContractPage({
                    propertyId: property.id,
                    contractId: property.Contract[0]!.id,
                  })}
                >
                  <Badge
                    leftSection={<IconCheck style={{ width: 10, height: 10 }} />}
                    variant="light"
                    color="green"
                    radius="xs"
                  >
                    Alquilada
                  </Badge>
                </Anchor>
              ) : (
                <Badge opacity={0.5} variant="light" color="gray" radius="xs">
                  No alquilada
                </Badge>
              ),
          },
          {
            accessor: "actions",
            title: "Acciones",
            textAlignment: "right",
            render: (property) => (
              <Group spacing={0} position="right" noWrap>
                <Link href={Routes.ShowPropertyPage({ propertyId: property.id })}>
                  <ActionIcon>
                    <IconEye size="1rem" stroke={1.5} />
                  </ActionIcon>
                </Link>
                <Link href={Routes.EditPropertyPage({ propertyId: property.id })}>
                  <ActionIcon>
                    <IconEdit size="1rem" stroke={1.5} />
                  </ActionIcon>
                </Link>
                <ActionIcon color="red" onClick={() => handleDelete(property)}>
                  <IconTrash size="1rem" stroke={1.5} />
                </ActionIcon>
              </Group>
            ),
          },
        ]}
        page={page + 1}
        onPageChange={(newPage) => goToPage(newPage)}
        totalRecords={count}
        recordsPerPage={recordsPerPage}
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
