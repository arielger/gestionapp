import { Flex, Text } from "@mantine/core"

export const DetailsList = ({
  details,
}: {
  details: {
    title: string
    value: string | number | React.ReactElement
  }[]
}) => {
  return (
    <Flex direction="column" gap="md">
      {details.map((detail) => (
        <Flex key={detail.title} direction="column">
          <Text size="sm" color={"gray.7"}>
            {detail.title}
          </Text>
          <Text size="md">{detail.value}</Text>
        </Flex>
      ))}
    </Flex>
  )
}
