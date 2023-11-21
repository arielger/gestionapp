import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { ActionIcon, Button, Group } from "@mantine/core"
import { IconEdit, IconTrash, IconEye } from "@tabler/icons-react"

import { DataTable } from "src/core/components/DataTable"
import Layout from "src/core/layouts/Layout"
import getTenants from "src/tenants/queries/getTenants"
import { usePaginatedTable } from "src/core/hooks/usePaginatedTable"
import { PageHeader } from "src/layout/components/PageHeader"
import { personTableCommonColumns } from "src/real-state-owners/config"

export const TenantsList = () => {
  const { tableProps } = usePaginatedTable({
    query: getTenants,
  })

  return (
    <>
      <DataTable
        {...tableProps}
        columns={[
          ...personTableCommonColumns,
          {
            accessor: "actions",
            title: "Acciones",
            textAlignment: "right",
            render: (tenant) => (
              <Group spacing={0} position="right" noWrap>
                <Link href={Routes.ShowTenantPage({ tenantId: tenant.id })}>
                  <ActionIcon>
                    <IconEye size="1rem" stroke={1.5} />
                  </ActionIcon>
                </Link>
                <Link href={Routes.EditTenantPage({ tenantId: tenant.id })}>
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
      />
    </>
  )
}

const TenantsPage = () => {
  return (
    <Layout>
      <Head>
        <title>Inquilinos</title>
      </Head>

      <div>
        <PageHeader title="Inquilinos">
          <Button variant="filled" component={Link} href={Routes.NewTenantPage()} size="md">
            Crear
          </Button>
        </PageHeader>

        <Suspense fallback={<div>Loading...</div>}>
          <TenantsList />
        </Suspense>
      </div>
    </Layout>
  )
}

export default TenantsPage
