import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useMutation } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import { ActionIcon, Anchor, Flex, Group, Button } from "@mantine/core"
import { IconEdit, IconTrash, IconEye } from "@tabler/icons-react"
import { DataTable } from "mantine-datatable"

import Layout from "src/core/layouts/Layout"
import getProperties from "src/properties/queries/getProperties"
import deleteProperty from "src/properties/mutations/deleteProperty"
import { usePaginatedTable } from "src/core/hooks/usePaginatedTable"
import { PageHeader } from "src/layout/components/PageHeader"

export const PropertiesList = () => {
  const router = useRouter()

  const { items, page, count, goToPage, recordsPerPage } = usePaginatedTable({
    query: getProperties,
  })

  const [deletePropertyMutation, { isLoading }] = useMutation(deleteProperty)

  const handleDelete = async (property: (typeof items)[number]) => {
    await deletePropertyMutation({ id: property.id })
    await router.push(Routes.PropertiesPage())
  }

  return (
    <>
      <DataTable
        withBorder
        borderRadius="sm"
        withColumnBorders
        striped
        highlightOnHover
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
              <Flex gap="xs">
                {property?.owners?.length > 0
                  ? property.owners.map((owner) => (
                      <Anchor
                        key={owner.id}
                        size="sm"
                        component={Link}
                        href={Routes.ShowRealStateOwnerPage({ realStateOwnerId: owner.id })}
                      >
                        {`${owner.firstName} ${owner.lastName}`}
                      </Anchor>
                    ))
                  : "-"}
              </Flex>
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

        <Suspense fallback={<div>Loading...</div>}>
          <PropertiesList />
        </Suspense>
      </div>
    </Layout>
  )
}

export default PropertiesPage
