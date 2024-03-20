import React from "react"
import { AppShell } from "@mantine/core"
import { NavBar } from "./NavBar/NavBar"
import HeaderMobile from "./HeaderMobile/HeaderMobile"
import { useMediaQuery } from "@mantine/hooks"

export const DashboardLayout = ({ children }: { children: React.ReactElement }) => {
  const isDesktop = useMediaQuery(`(min-width: 768px)`)
  return (
    <AppShell
      padding="lg"
      navbar={{ width: 300, breakpoint: "sm" }}
      styles={(theme) => ({
        main: { backgroundColor: theme.colors.gray[0] },
      })}
    >
      {!isDesktop && <HeaderMobile />}
      <AppShell.Navbar>
        <NavBar />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}
