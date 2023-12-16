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
              c="black"
              key={person.id}
              size="sm"
              component={Link}
              href={handlePress(person.id)}
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              <Text mr={4} span>{`${person.firstName} ${person.lastName}`}</Text>
              <IconExternalLink color="gray" size={16} />
            </Anchor>
          ))
        : "-"}
    </Flex>
  )
}
