import { useRouter } from "next/router"
import { UnstyledButton } from "@mantine/core"
import { IconCreditCard, IconHome, IconLogout, IconUser } from "@tabler/icons-react"
import { useMutation } from "@blitzjs/rpc"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import logout from "src/auth/mutations/logout"
import classes from "./NavBar.module.css"
import { NavBarHeader } from "./NavBarHeader"

const data = [
  { link: Routes.PropertiesPage(), label: "Propiedades", icon: IconHome },
  { link: Routes.ClientsPage(), label: "Clientes", icon: IconUser },
  { link: Routes.PaymentsPage(), label: "Pagos", icon: IconCreditCard },
  { link: Routes.NewPaymentPage(), label: "Nuevo pago", icon: IconCreditCard },
] as const

interface INavBarProps {
  handleLinkClick: () => void
  showCompanyHeader: boolean
}

export const NavBar = ({ handleLinkClick, showCompanyHeader }: INavBarProps) => {
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
        onClick={handleLinkClick}
      >
        <item.icon className={classes.linkIcon} stroke={1.5} />
        <span>{item.label}</span>
      </Link>
    )
  })

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        {!showCompanyHeader && <NavBarHeader />}
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
