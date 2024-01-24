import { Flex, Progress, Stack, Text } from "@mantine/core"
import { Contract } from "@prisma/client"
import { getPorcentageProgressFromRange } from "src/core/dates/utils"

export const ContractProgress = ({ contract }: { contract: Contract }) => {
  const progressPercentage = getPorcentageProgressFromRange(contract.startDate, contract.endDate)

  return (
    <Stack gap={0}>
      <Flex justify="space-between">
        <Text size="sm">{contract.startDate.toLocaleDateString()}</Text>
        <Text size="sm">{contract.endDate.toLocaleDateString()}</Text>
      </Flex>
      <Flex align="center" gap="sm">
        <Progress
          value={progressPercentage}
          color="green"
          style={{
            flex: 1,
          }}
        />
        <Text size="sm">{`${Math.max(Math.ceil(progressPercentage), 0)}%`}</Text>
      </Flex>
    </Stack>
  )
}
