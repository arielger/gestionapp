import { Button, Modal, Text } from "@mantine/core"
import { DataTable } from "mantine-datatable"
import { Routes } from "@blitzjs/next"

import { PaymentWithDetails } from "../types"
import { getActivityTitle } from "src/activities/utils"
import { formatMoneyAmount } from "src/core/numbers/utils"
import { getPaymentAmount } from "../utils"
import { ExternalLink } from "src/core/components/ExternalLink"
import { PersonList } from "src/clients/components/PersonList"

export const PaymentDetailsModal = ({
  payment,
  handleClose,
}: {
  payment?: PaymentWithDetails
  handleClose: () => void
}) => {
  return (
    <Modal opened={!!payment} onClose={handleClose} title={`Pago #${payment?.id}`}>
      {payment && (
        <>
          <Text>Fecha: {payment.createdAt.toLocaleDateString()}</Text>
          <Text>
            Propiedad:
            <ExternalLink
              href={Routes.ShowPropertyPage({ propertyId: payment.contract.property.id })}
            >
              {payment.contract.property.address}
            </ExternalLink>
          </Text>
          <Text>
            Propietario/s:
            <PersonList list={payment.contract.owners.map((owner) => owner.client) ?? []} />
          </Text>
          <Text>
            Inquilino/s:
            <PersonList list={payment.contract.owners.map((owner) => owner.client) ?? []} />
          </Text>
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
          <Button component="a" href={`/api/payments/pdf/${payment.id}`} target="_blank">
            Descargar comprobante de inquilino
          </Button>
          <Button
            onClick={() => {
              console.log("notify")
            }}
          >
            Enviar email al inquilino
          </Button>
        </>
      )}
    </Modal>
  )
}
