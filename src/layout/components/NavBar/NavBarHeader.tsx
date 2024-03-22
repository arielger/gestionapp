import { Avatar, Flex, Text } from "@mantine/core"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { getInitials } from "src/core/strings/utils"

export const NavBarHeader = () => {
  const currentUser = useCurrentUser()
  const orgName = currentUser?.memberships?.[0]?.organization.name

  return (
    <Flex align="center" mb={{ base: "auto", lg: "lg" }} mt={5}>
      <Avatar src={"./logo.jpeg"} color="cyan" radius="sm" mr={"sm"}>
        {getInitials(orgName ?? "", true)}
      </Avatar>
      <Flex direction="column" miw={0}>
        <Text size="h5" c="gray.8" lineClamp={1} fw={700}>
          {orgName}
        </Text>
        <Text c="dimmed" truncate="end">
          {currentUser?.email}
        </Text>
      </Flex>
    </Flex>
  )
}
