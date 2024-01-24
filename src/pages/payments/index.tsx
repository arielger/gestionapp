import { Suspense } from "react"
import Head from "next/head"
import { Group, ActionIcon, Badge, Flex, Text } from "@mantine/core"
import { IconEye } from "@tabler/icons-react"

import { DataTable, actionsColumnConfig } from "src/core/components/DataTable"
import Layout from "src/core/layouts/Layout"
import getPayments from "src/payments/queries/getPayments"
import { usePaginatedTable } from "src/core/hooks/usePaginatedTable"
import { PageHeader } from "src/layout/components/PageHeader"
import { PersonList } from "src/clients/components/PersonList"
import { getPaymentAmount } from "src/payments/utils"
import { getActivityTitle } from "src/activities/utils"
import { Routes } from "@blitzjs/next"
import { PaymentWithDetails, getPaymentsInclude } from "src/payments/types"
import { ExternalLink } from "src/core/components/ExternalLink"
import router from "next/router"

export const ClientsList = () => {
  const { tableProps } = usePaginatedTable({
    query: getPayments,
    queryParams: {
      include: getPaymentsInclude,
    },
  })

  return (
    <>
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
            width: 100,
            render: (row: PaymentWithDetails) => row.createdAt.toLocaleDateString(),
          },
          {
            accessor: "contract.property.address",
            title: "Propiedad",
            width: 200,
            render: (row: PaymentWithDetails) => (
              <ExternalLink
                href={Routes.ShowPropertyPage({ propertyId: row.contract.property.id })}
              >
                {row.contract.property.address}
              </ExternalLink>
            ),
          },
          {
            accessor: "contract.owners",
            title: "Propietario/s",
            width: 200,
            render: (row: PaymentWithDetails) => (
              <PersonList list={row.contract.owners.map((owner) => owner.client) ?? []} />
            ),
          },
          {
            accessor: "contract.tenants",
            title: "Inquilino/s",
            width: 200,
            render: (row: PaymentWithDetails) => (
              <PersonList list={row.contract.tenants.map((tenant) => tenant.client) ?? []} />
            ),
          },
          {
            accessor: "concepts",
            title: "Detalle",
            width: 260,
            render: (row: PaymentWithDetails) =>
              row.items[0] ? (
                <Flex style={{ whiteSpace: "nowrap" }}>
                  <Text size="sm">{getActivityTitle(row.items[0])}</Text>
                  {row.items.length > 1 ? (
                    <Badge variant="light" radius="sm" color="gray">
                      +{row.items.length - 1}
                    </Badge>
                  ) : undefined}
                </Flex>
              ) : undefined,
          },
          {
            accessor: "itemsTotal",
            title: "Monto",
            width: 100,
            render: (row: PaymentWithDetails) => getPaymentAmount(row),
          },
          {
            ...actionsColumnConfig,
            render: (row: PaymentWithDetails) => (
              <Group gap={4} justify="right" wrap="nowrap">
                <ActionIcon
                  onClick={() => {
                    void router.push(Routes.ShowPaymentPage({ paymentId: row.id }))
                  }}
                  size="sm"
                  variant="subtle"
                >
                  <IconEye size="1rem" stroke={1.5} />
                </ActionIcon>
              </Group>
            ),
          },
        ]}
      />
    </>
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

PaymentsPage.authenticate = true

export default PaymentsPage
