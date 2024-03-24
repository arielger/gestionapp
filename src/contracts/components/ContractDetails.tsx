import { Text } from "@mantine/core"
import { ContractFeeType, Prisma } from "@prisma/client"

import { DetailsList } from "src/core/components/DetailsList"
import { PersonList } from "src/clients/components/PersonList"
import { ContractProgress } from "./ContractProgress"
import ResponsivePaper from "src/core/components/ResponsivePaper"

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
    <ResponsivePaper shadow="xs" style={{ flex: 1 }}>
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
    </ResponsivePaper>
  )
}
