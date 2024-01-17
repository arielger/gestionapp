import { Breadcrumbs, Flex, Title } from "@mantine/core"
import { PropsWithChildren } from "react"

export const PageHeader = ({
  title,
  breadcrumbs,
  afterTitle,
  children,
}: PropsWithChildren<{
  title: string
  breadcrumbs?: React.ReactElement[]
  afterTitle?: React.ReactElement
}>) => {
  return (
    <Flex justify="space-between" align="center" mb={16}>
      <Flex direction="column" gap="xs">
        {breadcrumbs && <Breadcrumbs separator="/">{breadcrumbs}</Breadcrumbs>}
        <Flex align="center">
          <Title order={3} fw={"normal"} mr="sm">
            {title}
          </Title>
          {afterTitle}
        </Flex>
      </Flex>
      {children}
    </Flex>
  )
}
