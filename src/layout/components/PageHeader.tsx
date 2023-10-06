import { Breadcrumbs, Flex, Title } from "@mantine/core"
import { PropsWithChildren } from "react"

export const PageHeader = ({
  title,
  breadcrumbs,
  children,
}: { title: string; breadcrumbs?: React.ReactElement[] } & PropsWithChildren) => {
  return (
    <Flex justify="space-between" align="center" mb={16}>
      <Flex direction="column" gap="xs">
        {breadcrumbs && <Breadcrumbs separator="/">{breadcrumbs}</Breadcrumbs>}
        <Title order={3} weight={"normal"}>
          {title}
        </Title>
      </Flex>
      {children}
    </Flex>
  )
}
