import { useRouter } from "next/router"
import { Avatar, Title, Flex, Text, UnstyledButton } from "@mantine/core"
import { IconCreditCard, IconHome, IconLogout, IconUser } from "@tabler/icons-react"
import { useMutation } from "@blitzjs/rpc"
import Link from "next/link"
import { Routes } from "@blitzjs/next"

import logout from "src/auth/mutations/logout"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import classes from "./Navbar.module.css"

const data = [
  { link: Routes.PropertiesPage(), label: "Propiedades", icon: IconHome },
  { link: Routes.RealStateOwnersPage(), label: "Propietarios", icon: IconUser },
  { link: Routes.TenantsPage(), label: "Inquilinos", icon: IconUser },
  { link: Routes.NewPaymentPage(), label: "Nuevo pago", icon: IconCreditCard },
]

export const NavBar = () => {
  const currentUser = useCurrentUser()

  const { asPath } = useRouter()

  const activePathname = new URL(asPath, location.href).pathname

  const [logoutMutation] = useMutation(logout)

  const links = data.map((item) => {
    const isActive = activePathname.startsWith(item.link.pathname)

    return (
      <Link
        className={classes.link}
        data-active={isActive || undefined}
        href={item.link}
        key={item.label}
      >
        <item.icon className={classes.linkIcon} stroke={1.5} />
        <span>{item.label}</span>
      </Link>
    )
  })

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Flex align="center" mb="lg">
          <Avatar src={"./logo.jpeg"} color="cyan" radius="sm" mr={"sm"}>
            GG
          </Avatar>
          <Flex direction="column" miw={0}>
            <Text size="h5" c="gray.8" lineClamp={1} fw={700}>
              {currentUser?.memberships?.[0]?.organization.name}
            </Text>
            <Text c="dimmed" truncate="end">
              {currentUser?.email}
            </Text>
          </Flex>
        </Flex>
        {links}
      </div>

      <div className={classes.footer}>
        <UnstyledButton className={classes.link} onClick={() => logoutMutation()}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Cerrar sesión</span>
        </UnstyledButton>
      </div>
    </nav>
  )
}
