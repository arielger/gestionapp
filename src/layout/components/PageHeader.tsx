import { Flex, Title } from "@mantine/core"
import { PropsWithChildren } from "react"

export const PageHeader = ({ title, children }: { title: string } & PropsWithChildren) => {
  return (
    <Flex justify="space-between" align="center" mb={16}>
      <Title order={2} weight={"normal"}>
        {title}
      </Title>
      {children}
    </Flex>
  )
}
