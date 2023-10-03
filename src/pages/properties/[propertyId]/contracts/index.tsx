import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { ActionIcon, Button, Flex, Group, Paper, Table, Title } from "@mantine/core"
import { IconEdit, IconTrash, IconEye } from "@tabler/icons-react"
import { useRouter } from "next/router"

import { DataTable } from "src/core/components/DataTable"
import { PageHeader } from "src/layout/components/PageHeader"
import Layout from "src/core/layouts/Layout"
import getContracts from "src/contracts/queries/getContracts"
import { usePaginatedTable } from "src/core/hooks/usePaginatedTable"

export const ContractsList = () => {
  const router = useRouter()
  const { items, page, count, goToPage, recordsPerPage } = usePaginatedTable({
    query: getContracts,
  })

  return (
    <>
      <DataTable
        records={items}
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
            render: (contract) => (
              <Group spacing={0} position="right" noWrap>
                <Link
                  href={Routes.ShowContractPage({
                    propertyId: router.query.propertyId as string,
                    contractId: contract.id,
                  })}
                >
                  <ActionIcon>
                    <IconEye size="1rem" stroke={1.5} />
                  </ActionIcon>
                </Link>
                <Link
                  href={Routes.EditContractPage({
                    propertyId: router.query.propertyId as string,
                    contractId: contract.id,
                  })}
                >
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

const ContractsPage = () => {
  const router = useRouter()

  return (
    <Layout>
      <Head>
        <title>Contracts</title>
      </Head>

      <div>
        <PageHeader title="Contracts">
          <Button
            variant="filled"
            component={Link}
            href={Routes.NewContractPage({
              propertyId: router.query.propertyId as string,
            })}
            size="md"
          >
            Crear
          </Button>
        </PageHeader>

        <Suspense fallback={<div>Loading...</div>}>
          <ContractsList />
        </Suspense>
      </div>
    </Layout>
  )
}

export default ContractsPage
