import { Routes } from "@blitzjs/next"
import { Anchor, Flex, Text } from "@mantine/core"
import { RealStateOwner, Tenant } from "@prisma/client"
import { IconExternalLink } from "@tabler/icons-react"
import { RouteUrlObject } from "blitz"
import Link from "next/link"

// TODO: move to general person module
export const PersonList = ({
  list,
  handlePress,
}: {
  list: (RealStateOwner | Tenant)[]
  handlePress: (id: number) => RouteUrlObject
}) => {
  return (
    <Flex gap="xs">
      {list?.length > 0
        ? list.map((person) => (
            <Anchor
              color="black"
              key={person.id}
              size="sm"
              component={Link}
              href={handlePress(person.id)}
            >
              <Flex align="center" gap={4}>
                <Text>{`${person.firstName} ${person.lastName}`}</Text>
                <IconExternalLink color="gray" size={16} />
              </Flex>
            </Anchor>
          ))
        : "-"}
    </Flex>
  )
}
