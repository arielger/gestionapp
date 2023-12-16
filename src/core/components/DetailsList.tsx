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
          <Text size="sm" c={"gray.7"}>
            {detail.title}
          </Text>
          {typeof detail.value === "string" ? <Text size="md">{detail.value}</Text> : detail.value}
        </Flex>
      ))}
    </Flex>
  )
}
