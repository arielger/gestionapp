import React from "react"
import { Breadcrumbs, Flex, Title } from "@mantine/core"
import { PropsWithChildren } from "react"

export const PageHeader = ({
  title,
  breadcrumbs,
  afterTitle,
  children,
  isDetailsPage = true,
}: PropsWithChildren<{
  title: string
  breadcrumbs?: React.ReactElement[]
  afterTitle?: React.ReactElement
  isDetailsPage?: boolean
}>) => {
  return (
    <Flex
      justify="space-between"
      align={isDetailsPage ? { base: "normal", xs: "center" } : { base: "center" }}
      mb={16}
      direction={isDetailsPage ? { base: "column", xs: "row" } : { base: "row" }}
      // direction={{ base: "column", xs: "row" }}
    >
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
