import { Button, Stack, Text } from "@mantine/core"
import { IconZoomExclamation } from "@tabler/icons-react"
import { RouteUrlObject } from "blitz"
import Link from "next/link"

export const NotFound = ({
  title,
  description,
  goBackRoute,
}: {
  title: string
  description: string
  goBackRoute: RouteUrlObject
}) => {
  return (
    <Stack align="center" mt={40}>
      <IconZoomExclamation size="4rem" />
      <Text size="lg">{title}</Text>
      <Text c="dimmed" style={{ textAlign: "center" }}>
        {description}
      </Text>
      <Button variant="subtle" size="md" component={Link} href={goBackRoute}>
        Volver
      </Button>
    </Stack>
  )
}
