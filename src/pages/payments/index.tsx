import { Suspense, useState } from "react"
import Head from "next/head"
import { Group, ActionIcon, Modal, Text, Button } from "@mantine/core"
import { IconEye } from "@tabler/icons-react"

import { DataTable, actionsColumnConfig } from "src/core/components/DataTable"
import Layout from "src/core/layouts/Layout"
import getPayments from "src/payments/queries/getPayments"
import { usePaginatedTable } from "src/core/hooks/usePaginatedTable"
import { PageHeader } from "src/layout/components/PageHeader"
import { PersonList } from "src/clients/components/PersonList"
import { Prisma } from "@prisma/client"
import { formatMoneyAmount } from "src/core/numbers/utils"
import { getPaymentAmount } from "src/payments/utils"
import { getActivityTitle } from "src/activities/utils"
import { activityWithDetailsInclude } from "src/activities/types"

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
  items: {
    include: activityWithDetailsInclude,
  },
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

  const [paymentDetails, setPaymentDetails] = useState<CustomPayment | undefined>(undefined)

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
            render: (row: CustomPayment) => getPaymentAmount(row),
          },
          {
            ...actionsColumnConfig,
            render: (row: CustomPayment) => (
              <Group gap={4} justify="right" wrap="nowrap">
                <ActionIcon
                  onClick={() => {
                    setPaymentDetails(row)
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
      <Modal
        opened={!!paymentDetails}
        onClose={() => setPaymentDetails(undefined)}
        title={`Pago #${paymentDetails?.id}`}
      >
        {paymentDetails && (
          <>
            <DataTable
              columns={[
                {
                  accessor: "title",
                  title: "Descripción",
                  width: 200,
                  render: (row) => getActivityTitle(row),
                },
                {
                  accessor: "amount",
                  title: "Monto",
                  width: 200,
                  render: (row) => formatMoneyAmount(row.amount),
                },
              ]}
              records={paymentDetails.items}
            />
            <Text>Total:</Text>
            <Text>{getPaymentAmount(paymentDetails)}</Text>
            <Button component="a" href={`/api/payments/pdf/${paymentDetails.id}`} target="_blank">
              Descargar comprobante de inquilino
            </Button>
          </>
        )}
      </Modal>
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

export default PaymentsPage
