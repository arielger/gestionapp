import React, { useCallback } from "react"
import { AppShell, Burger, Group, useMantineTheme } from "@mantine/core"
import { NavBar } from "./NavBar/NavBar"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import { NavBarHeader } from "./NavBar/NavBarHeader"

export const DashboardLayout = ({ children }: { children: React.ReactElement }) => {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure()
  const theme = useMantineTheme()
  const isDesktop = useMediaQuery(`(min-width: ${theme.breakpoints.lg})`)
  const showCompanyHeader = !isDesktop

  const handleLinkClick = useCallback(() => {
    if (!isDesktop) {
      toggleMobile()
    }
  }, [isDesktop, toggleMobile])

  return (
    <AppShell
      header={{
        collapsed: isDesktop,
        height: 60,
      }}
      padding="lg"
      navbar={{
        width: 300,
        breakpoint: "lg",
        collapsed: { mobile: !mobileOpened, desktop: false },
      }}
      styles={(theme) => ({
        main: { backgroundColor: theme.colors.gray[0] },
      })}
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="lg" size="sm" />
          <NavBarHeader />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <NavBar handleLinkClick={handleLinkClick} showCompanyHeader={showCompanyHeader} />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}
