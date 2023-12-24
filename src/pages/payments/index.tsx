import { Suspense } from "react"
import Head from "next/head"
import { Group } from "@mantine/core"

import { DataTable, actionsColumnConfig } from "src/core/components/DataTable"
import Layout from "src/core/layouts/Layout"
import getPayments from "src/payments/queries/getPayments"
import { usePaginatedTable } from "src/core/hooks/usePaginatedTable"
import { PageHeader } from "src/layout/components/PageHeader"
import { PersonList } from "src/clients/components/PersonList"
import { Prisma } from "@prisma/client"
import { formatMoneyAmount } from "src/core/numbers/utils"

const getPaymentsInclude = {
  contract: {
    include: {
      property: true,
      owners: {
        include: {
          client: true,
        },
      },
      tenants: {
        include: {
          client: true,
        },
      },
    },
  },
  items: true,
}

type CustomPayment = Prisma.PaymentGetPayload<{
  include: typeof getPaymentsInclude
}>

export const ClientsList = () => {
  const { tableProps } = usePaginatedTable({
    query: getPayments,
    queryParams: {
      include: getPaymentsInclude,
    },
  })

  return (
    <DataTable
      {...tableProps}
      columns={[
        {
          accessor: "id",
          title: "#",
          textAlign: "right" as const,
          width: 60,
        },
        {
          accessor: "createdAt",
          title: "Fecha",
          width: 200,
          render: (row: CustomPayment) => row.createdAt.toLocaleDateString(),
        },
        { accessor: "contract.property.address", title: "Propiedad", width: 200 },
        {
          accessor: "contract.owners",
          title: "Propietario/s",
          width: 200,
          render: (row: CustomPayment) => (
            <PersonList list={row.contract.owners.map((owner) => owner.client) ?? []} />
          ),
        },
        {
          accessor: "contract.tenants",
          title: "Inquilino/s",
          width: 200,
          render: (row: CustomPayment) => (
            <PersonList list={row.contract.tenants.map((tenant) => tenant.client) ?? []} />
          ),
        },
        {
          accessor: "itemsTotal",
          title: "Monto",
          width: 200,
          render: (row: CustomPayment) => {
            const amount = row.items.reduce((acc, item) => acc + item.amount, 0)
            return formatMoneyAmount(amount)
          },
        },
        // {
        //   ...actionsColumnConfig,
        //   render: () => (
        //     <Group gap={4} justify="right" wrap="nowrap">
        //       {/* TODO: Add payment detail page */}
        //       <Link href={Routes.ShowClientPage({ clientId: client.id })}>
        //         <ActionIcon size="sm" variant="subtle">
        //           <IconEye size="1rem" stroke={1.5} />
        //         </ActionIcon>
        //       </Link>
        //     </Group>
        //   ),
        // },
      ]}
    />
  )
}

const PaymentsPage = () => {
  return (
    <Layout>
      <Head>
        <title>Pagos</title>
      </Head>

      <div>
        <PageHeader title="Pagos" />

        <Suspense fallback={<div>Loading...</div>}>
          <ClientsList />
        </Suspense>
      </div>
    </Layout>
  )
}

export default PaymentsPage
