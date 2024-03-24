import React from "react"
import { Breadcrumbs, Flex, Title } from "@mantine/core"
import { PropsWithChildren } from "react"

export const PageHeader = ({
  title,
  breadcrumbs,
  afterTitle,
  rightSection,
  wrapRightSectionInMobile = true,
}: PropsWithChildren<{
  title: string
  rightSection?: React.ReactElement
  breadcrumbs?: React.ReactElement[]
  afterTitle?: React.ReactElement
  wrapRightSectionInMobile?: boolean // If true, the elements on the right are placed below the title
}>) => {
  return (
    <Flex
      justify="space-between"
      align={wrapRightSectionInMobile ? { base: "normal", xs: "center" } : { base: "center" }}
      mb={16}
      direction={wrapRightSectionInMobile ? { base: "column", xs: "row" } : { base: "row" }}
      gap={"sm"}
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
      {rightSection}
    </Flex>
  )
}
