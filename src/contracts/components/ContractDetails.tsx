import { Routes } from "@blitzjs/next"
import { Paper, Text } from "@mantine/core"
import { ContractFeeType, Prisma } from "@prisma/client"

import { DetailsList } from "src/core/components/DetailsList"
import { PersonList } from "src/clients/components/PersonList"

type ContractWithRelatedEntities = Prisma.ContractGetPayload<{
  include: {
    tenants: {
      include: {
        client: true
      }
    }
  }
}>

export const ContractDetails = ({ contract }: { contract: ContractWithRelatedEntities }) => {
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
            value: `${contract.startDate.toLocaleDateString()} - ${contract.endDate.toLocaleDateString()}`,
          },
          {
            title: "Monto",
            value: new Intl.NumberFormat().format(contract.rentAmount),
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
