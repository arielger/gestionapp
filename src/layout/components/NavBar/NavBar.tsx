import { useRouter } from "next/router"
import { Avatar, Flex, Text, UnstyledButton } from "@mantine/core"
import { IconCreditCard, IconHome, IconLogout, IconUser } from "@tabler/icons-react"
import { useMutation } from "@blitzjs/rpc"
import { useRouterQuery } from "@blitzjs/next"
import Link from "next/link"
import { Routes } from "@blitzjs/next"

import logout from "src/auth/mutations/logout"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import classes from "./NavBar.module.css"
import { getInitials } from "src/core/strings/utils"

const data = [
  { link: Routes.PropertiesPage(), label: "Propiedades", icon: IconHome },
  { link: Routes.ClientsPage({ type: "owners" }), label: "Propietarios", icon: IconUser },
  { link: Routes.ClientsPage({ type: "tenants" }), label: "Inquilinos", icon: IconUser },
  { link: Routes.PaymentsPage(), label: "Pagos", icon: IconCreditCard },
  { link: Routes.NewPaymentPage(), label: "Nuevo pago", icon: IconCreditCard },
] as const

export const NavBar = () => {
  const currentUser = useCurrentUser()

  const { asPath } = useRouter()
  const activePathname = new URL(asPath, location.href).pathname

  const query = useRouterQuery()

  const [logoutMutation] = useMutation(logout)

  const links = data.map((item) => {
    const isActive =
      activePathname.startsWith(item.link.pathname) &&
      (item.link.query as { type: string })?.type === query.type

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

  const orgName = currentUser?.memberships?.[0]?.organization.name

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Flex align="center" mb="lg">
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
