import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import { ActionIcon, Button, Flex, Group, Paper, Table, Title } from "@mantine/core"
import { IconEdit, IconTrash, IconEye } from "@tabler/icons-react"

import Layout from "src/core/layouts/Layout"
import getProperties from "src/properties/queries/getProperties"

const ITEMS_PER_PAGE = 100

// TODO: Move all the list features to a common component (when we create another entity)

export const PropertiesList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ properties, hasMore }] = usePaginatedQuery(getProperties, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  const rows = properties.map((property) => (
    <tr key={property.id}>
      <td>{property.id}</td>
      <td>{property.address}</td>
      <td>...</td>
      <td>
        <Group spacing={0} position="right">
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
          <ActionIcon color="red">
            <IconTrash size="1rem" stroke={1.5} />
          </ActionIcon>
        </Group>
      </td>
    </tr>
  ))

  return (
    <>
      <Paper shadow="xs" p="sm" mb={16}>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Dirección</th>
              <th>Propietario</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Paper>
      <Flex justify="flex-end">
        <Button disabled={page === 0} onClick={goToPreviousPage} mr={8}>
          Anterior
        </Button>
        <Button disabled={!hasMore} onClick={goToNextPage}>
          Siguiente
        </Button>
      </Flex>
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
        <Flex justify="space-between" mb={16}>
          <Title order={2}>Propiedades</Title>
          <Button component={Link} href={Routes.NewPropertyPage()} size="md">
            Crear nueva
          </Button>
        </Flex>

        <Suspense fallback={<div>Loading...</div>}>
          <PropertiesList />
        </Suspense>
      </div>
    </Layout>
  )
}

export default PropertiesPage
