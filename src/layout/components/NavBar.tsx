import { useState } from "react"
import { useRouter } from "next/router"
import {
  createStyles,
  Navbar,
  getStylesRef,
  rem,
  UnstyledButton,
  Avatar,
  Title,
  Flex,
  Text,
} from "@mantine/core"
import { IconCreditCard, IconHome, IconLogout, IconUser } from "@tabler/icons-react"
import { useMutation } from "@blitzjs/rpc"
import Link from "next/link"
import { Routes } from "@blitzjs/next"

import logout from "src/auth/mutations/logout"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

const useStyles = createStyles((theme) => ({
  header: {
    paddingBottom: theme.spacing.md,
    marginBottom: `calc(${theme.spacing.md} * 1.5)`,
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  link: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7],
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
    width: "100%",

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,

      [`& .${getStylesRef("icon")}`]: {
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
      },
    },
  },

  linkIcon: {
    ref: getStylesRef("icon"),
    color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({ variant: "light", color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor }).color,
      [`& .${getStylesRef("icon")}`]: {
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor }).color,
      },
    },
  },
}))

const data = [
  { link: Routes.PropertiesPage(), label: "Propiedades", icon: IconHome },
  { link: Routes.RealStateOwnersPage(), label: "Propietarios", icon: IconUser },
  { link: Routes.TenantsPage(), label: "Inquilinos", icon: IconUser },
  { link: Routes.NewPaymentPage(), label: "Nuevo pago", icon: IconCreditCard },
]

export function NavigationBar() {
  const { classes, cx } = useStyles()
  const { asPath } = useRouter()

  const currentUser = useCurrentUser()

  const activePathname = new URL(asPath, location.href).pathname

  const [logoutMutation] = useMutation(logout)

  const links = data.map((item) => (
    <Link
      className={cx(classes.link, {
        [classes.linkActive]: activePathname.startsWith(item.link.pathname),
      })}
      href={item.link}
      key={item.label}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ))

  return (
    <Navbar width={{ sm: 300 }} p="md">
      <Flex align="center" mb="lg">
        <Avatar src={"./logo.jpeg"} color="cyan" radius="sm" mr={"sm"}>
          GG
        </Avatar>
        <Flex direction="column" miw={0}>
          <Title size="h5" c="gray.8">
            {currentUser?.memberships?.[0]?.organization.name}
          </Title>
          <Text c="dimmed" truncate="end">
            {currentUser?.email}
          </Text>
        </Flex>
      </Flex>

      <Navbar.Section grow>{links}</Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <UnstyledButton onClick={() => logoutMutation()} className={classes.link}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Cerrar sesión</span>
        </UnstyledButton>
      </Navbar.Section>
    </Navbar>
  )
}
