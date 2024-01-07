import { Routes } from "@blitzjs/next"
import { Flex } from "@mantine/core"
import { Client } from "@prisma/client"
import { ExternalLink } from "src/core/components/ExternalLink"

export const PersonList = ({ list }: { list: Client[] }) => {
  return (
    <Flex gap="xs">
      {list?.length > 0
        ? list.map((person) => (
            <ExternalLink key={person.id} href={Routes.ShowClientPage({ clientId: person.id })}>
              {`${person.firstName} ${person.lastName}`}
            </ExternalLink>
          ))
        : "-"}
    </Flex>
  )
}
