import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { ActionIcon, Button, Flex, Group, Paper, Table, Title } from "@mantine/core"
import { IconEdit, IconTrash, IconEye } from "@tabler/icons-react"

import { DataTable } from "src/core/components/DataTable"
import { PageHeader } from "src/layout/components/PageHeader"
import Layout from "src/core/layouts/Layout"
import get__ModelNames__ from "src/__modelNames__/queries/get__ModelNames__"
import { usePaginatedTable } from "src/core/hooks/usePaginatedTable"

export const __ModelNames__List = () => {
  const { tableProps } = usePaginatedTable({
    query: get__ModelNames__,
  })

  return (
    <>
      <DataTable
        {...tableProps}
        columns={[
          {
            accessor: "id",
            title: "#",
            textAlignment: "right",
            width: 60,
          },
          // TEMPLATE: COMPLETE TABLE
          {
            accessor: "actions",
            title: "Acciones",
            textAlignment: "right",
            render: (__modelName__) => (
              <Group spacing={0} position="right" noWrap>
                <Link href={Routes.Show__ModelName__Page({ __modelName__Id: __modelName__.id })}>
                  <ActionIcon>
                    <IconEye size="1rem" stroke={1.5} />
                  </ActionIcon>
                </Link>
                <Link href={Routes.Edit__ModelName__Page({ __modelName__Id: __modelName__.id })}>
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

const __ModelNames__Page = () => {
  return (
    <Layout>
      <Head>
        <title>__ModelNames__</title>
      </Head>

      <div>
        <PageHeader title="__ModelNames__">
          <Button variant="filled" component={Link} href={Routes.New__ModelName__Page()} size="md">
            Crear
          </Button>
        </PageHeader>

        <Suspense fallback={<div>Loading...</div>}>
          <__ModelNames__List />
        </Suspense>
      </div>
    </Layout>
  )
}

export default __ModelNames__Page
