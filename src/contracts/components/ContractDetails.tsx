import { Paper, Text } from "@mantine/core"
import { ContractFeeType, Prisma } from "@prisma/client"

import { DetailsList } from "src/core/components/DetailsList"
import { PersonList } from "src/clients/components/PersonList"
import { ContractProgress } from "./ContractProgress"
import { indexUpdateFrequencyToString, updateIndexToString } from "../config"

type ContractWithRelatedEntities = Prisma.ContractGetPayload<{
  include: {
    tenants: {
      include: {
        client: true
      }
    }
  }
}>

export const ContractDetails = ({
  contract,
  updatedAmount,
}: {
  contract: ContractWithRelatedEntities
  updatedAmount?: number
}) => {
  return (
    <Paper shadow="xs" p="xl" style={{ flex: 1 }}>
      <Text>Detalles del contrato</Text>
      <DetailsList
        details={[
          {
            title: "Inquilino/s",
            value: <PersonList list={contract.tenants.map((tenant) => tenant.client) ?? []} />,
          },
          {
            title: "Periodo",
            value: <ContractProgress contract={contract} />,
          },
          {
            title: "Monto actualizado",
            value: updatedAmount ? new Intl.NumberFormat().format(updatedAmount) : "-",
          },
          {
            title: "Monto inicial",
            value: new Intl.NumberFormat().format(contract.rentAmount),
          },
          {
            title: "Actualización",
            value:
              contract.updateAmountType && contract.updateAmountFrequency
                ? `${updateIndexToString[contract.updateAmountType]} - ${
                    indexUpdateFrequencyToString[contract.updateAmountFrequency]
                  }`
                : "Sin actualización",
          },
          {
            title: "Comisión",
            // todo: create percentage and $ amount formatting fn
            value:
              contract.feeType === ContractFeeType.PERCENTAGE
                ? `${contract.fee * 100}%`
                : `$${contract.fee} (fijo)`,
          },
        ]}
      />
    </Paper>
  )
}
