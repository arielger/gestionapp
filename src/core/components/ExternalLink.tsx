import { Anchor, AnchorProps, Text } from "@mantine/core"
import Link, { LinkProps } from "next/link"

import { IconExternalLink } from "@tabler/icons-react"
import { PropsWithChildren } from "react"

export const ExternalLink = ({
  children,
  ...props
}: PropsWithChildren<AnchorProps & LinkProps>) => {
  return (
    <Anchor
      c="black"
      size="sm"
      component={Link}
      style={{ display: "inline-flex", alignItems: "center" }}
      {...props}
    >
      <Text mr={4} span>
        {children}
      </Text>
      <IconExternalLink color="gray" size={16} />
    </Anchor>
  )
}
