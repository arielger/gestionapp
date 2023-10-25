import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { ActionIcon, Button, Flex, Group, Title } from "@mantine/core"
import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react"

import { DataTable } from "src/core/components/DataTable"
import Layout from "src/core/layouts/Layout"
import getRealStateOwners from "src/real-state-owners/queries/getRealStateOwners"
import { usePaginatedTable } from "src/core/hooks/usePaginatedTable"
import { PageHeader } from "src/layout/components/PageHeader"

export const RealStateOwnersList = () => {
  const { items, page, count, goToPage, recordsPerPage, isLoading } = usePaginatedTable({
    query: getRealStateOwners,
  })

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
          { accessor: "firstName", title: "Nombre" },
          { accessor: "lastName", title: "Apellido" },
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
        <PageHeader title="Propietarios">
          <Button variant="filled" component={Link} href={Routes.NewRealStateOwnerPage()} size="md">
            Crear
          </Button>
        </PageHeader>

        <RealStateOwnersList />
      </div>
    </Layout>
  )
}

export default RealStateOwnersPage
