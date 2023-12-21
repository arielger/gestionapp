import { Routes } from "@blitzjs/next"
import { Anchor, Flex, Text } from "@mantine/core"
import { Client } from "@prisma/client"
import { IconExternalLink } from "@tabler/icons-react"
import Link from "next/link"

export const PersonList = ({ list }: { list: Client[] }) => {
  return (
    <Flex gap="xs">
      {list?.length > 0
        ? list.map((person) => (
            <Anchor
              c="black"
              key={person.id}
              size="sm"
              component={Link}
              href={Routes.ShowClientPage({ clientId: person.id })}
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
