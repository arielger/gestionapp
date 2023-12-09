import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { ActionIcon, Button, Group } from "@mantine/core"
import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react"

import { DataTable, actionsColumnConfig } from "src/core/components/DataTable"
import Layout from "src/core/layouts/Layout"
import getRealStateOwners from "src/real-state-owners/queries/getRealStateOwners"
import { usePaginatedTable } from "src/core/hooks/usePaginatedTable"
import { PageHeader } from "src/layout/components/PageHeader"
import { personTableCommonColumns } from "src/real-state-owners/config"

export const RealStateOwnersList = () => {
  const { tableProps } = usePaginatedTable({
    query: getRealStateOwners,
  })

  return (
    <>
      <DataTable
        columns={[
          ...personTableCommonColumns,
          {
            ...actionsColumnConfig,
            render: (owner) => (
              <Group gap={4} justify="right" wrap="nowrap">
                <Link href={Routes.ShowRealStateOwnerPage({ realStateOwnerId: owner.id })}>
                  <ActionIcon size="sm" variant="subtle">
                    <IconEye size="1rem" stroke={1.5} />
                  </ActionIcon>
                </Link>
                <Link href={Routes.EditRealStateOwnerPage({ realStateOwnerId: owner.id })}>
                  <ActionIcon size="sm" variant="subtle">
                    <IconEdit size="1rem" stroke={1.5} />
                  </ActionIcon>
                </Link>
                <ActionIcon size="sm" variant="subtle" color="red">
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
