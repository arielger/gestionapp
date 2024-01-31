import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import { NotFoundError } from "blitz"
import { Anchor, Button, Center, Loader, Paper, Flex } from "@mantine/core"

import { PageHeader } from "src/layout/components/PageHeader"
import { NotFound } from "src/core/components/NotFound"
import getPayment from "src/payments/queries/getPayment"
import { ExternalLink } from "src/core/components/ExternalLink"
import { PersonList } from "src/clients/components/PersonList"
import { DataTable } from "src/core/components/DataTable"
import { getActivityTitle } from "src/activities/utils"
import { formatMoneyAmount } from "src/core/numbers/utils"
import { getPaymentAmount } from "src/payments/utils"
import { DetailsList } from "src/core/components/DetailsList"
import { IconFileDescription } from "@tabler/icons-react"
import { IconMail } from "@tabler/icons-react"
import { getAddressString } from "src/properties/utils"

export const Payment = () => {
  const paymentId = useParam("paymentId", "number")!

  const [payment, { isLoading: isLoadingPayment, error }] = useQuery(
    getPayment,
    { id: paymentId },
    {
      suspense: false,
      refetchOnWindowFocus: false,
    }
  )

  const notFound = (error as NotFoundError)?.name === NotFoundError.name

  if (notFound) {
    return (
      <NotFound
        title="Pago no encontrada"
        description={
          "No encontramos el pago que estás buscando.\n Por favor, verificá el ID ingresado"
        }
        goBackRoute={Routes.PaymentsPage()}
      />
    )
  }

  if (isLoadingPayment || !payment) {
    return (
      <Center>
        <Loader mt={160} />
      </Center>
    )
  }

  const propertyAddress = getAddressString({
    address: payment.contract.property.address,
  })

  return (
    <>
      <Head>
        <title>Propiedad {paymentId}</title>
      </Head>

      <div>
        <PageHeader
          title={`Pago #${payment.id} - ${propertyAddress}`}
          breadcrumbs={[
            <Anchor component={Link} href={Routes.PropertiesPage()} key="properties">
              Pagos
            </Anchor>,
            <Anchor
              component={Link}
              href={Routes.ShowPaymentPage({ paymentId: paymentId })}
              key="payment"
            >
              #{paymentId}
            </Anchor>,
          ]}
        />
        <Paper shadow="xs" p="xl">
          <DetailsList
            details={[
              {
                title: "Fecha",
                value: payment.createdAt.toLocaleDateString(),
              },
              {
                title: "Propiedad",
                value: (
                  <ExternalLink
                    href={Routes.ShowPropertyPage({ propertyId: payment.contract.property.id })}
                  >
                    {propertyAddress}
                  </ExternalLink>
                ),
              },
              {
                title: "Propietario/s",
                value: (
                  <PersonList list={payment.contract.owners.map((owner) => owner.client) ?? []} />
                ),
              },
              {
                title: "Inquilino/s",
                value: (
                  <PersonList list={payment.contract.owners.map((owner) => owner.client) ?? []} />
                ),
              },
              {
                title: "Detalle",
                value: (
                  <DataTable
                    columns={[
                      {
                        accessor: "title",
                        title: "Descripción",
                        width: 200,
                        render: (row) => getActivityTitle(row),
                        footer: "Total",
                      },
                      {
                        accessor: "amount",
                        title: "Monto",
                        width: 200,
                        render: (row) => formatMoneyAmount(row.amount),
                        footer: getPaymentAmount(payment),
                      },
                    ]}
                    records={payment.items}
                  />
                ),
              },
            ]}
          />
          <Flex gap="sm" mt={"md"} justify={"flex-end"}>
            <Button
              variant="default"
              component="a"
              href={`/api/payments/pdf/${payment.id}`}
              target="_blank"
              leftSection={<IconFileDescription size={14} />}
            >
              Ver comprobante
            </Button>
            <Button
              onClick={() => {
                console.log("notify")
              }}
              leftSection={<IconMail size={14} />}
            >
              Notificar pago via email
            </Button>
          </Flex>
        </Paper>
      </div>
    </>
  )
}

const ShowPaymentPage = () => {
  return <Payment />
}

ShowPaymentPage.authenticate = true

export default ShowPaymentPage
