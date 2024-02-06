import React from "react"
import { AppShell } from "@mantine/core"
import { NavBar } from "./NavBar/NavBar"

export const DashboardLayout = ({ children }: { children: React.ReactElement }) => {
  return (
    <AppShell
      padding="lg"
      navbar={{ width: 300, breakpoint: "sm" }}
      styles={(theme) => ({
        main: { backgroundColor: theme.colors.gray[0] },
      })}
    >
      <AppShell.Navbar>
        <NavBar />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}
