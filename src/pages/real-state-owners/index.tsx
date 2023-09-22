import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { DataTable } from "mantine-datatable"
import { ActionIcon, Button, Flex, Group, Title } from "@mantine/core"
import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react"

import Layout from "src/core/layouts/Layout"
import getRealStateOwners from "src/real-state-owners/queries/getRealStateOwners"
import { usePaginatedTable } from "src/core/hooks/usePaginatedTable"

export const RealStateOwnersList = () => {
  const { items, page, count, goToPage, recordsPerPage } = usePaginatedTable({
    query: getRealStateOwners,
  })

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
          },
          { accessor: "firstName" },
          { accessor: "lastName" },
          {
            accessor: "actions",
            textAlignment: "right",
            render: (owner) => (
              <Group spacing={0} position="right" noWrap>
                <Link href={Routes.ShowRealStateOwnerPage({ realStateOwnerId: owner.id })}>
                  <ActionIcon>
                    <IconEye size="1rem" stroke={1.5} />
                  </ActionIcon>
                </Link>
                <Link href={Routes.EditRealStateOwnerPage({ realStateOwnerId: owner.id })}>
                  <ActionIcon>
                    <IconEdit size="1rem" stroke={1.5} />
                  </ActionIcon>
                </Link>
                <ActionIcon color="red">
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

const RealStateOwnersPage = () => {
  return (
    <Layout>
      <Head>
        <title>Propietarios</title>
      </Head>

      <div>
        <Flex justify="space-between" align="center" mb={16}>
          <Title order={2}>Propietarios</Title>
          <Button variant="filled" component={Link} href={Routes.NewRealStateOwnerPage()} size="md">
            Crear
          </Button>
        </Flex>

        <Suspense fallback={<div>Loading...</div>}>
          <RealStateOwnersList />
        </Suspense>
      </div>
    </Layout>
  )
}

export default RealStateOwnersPage
