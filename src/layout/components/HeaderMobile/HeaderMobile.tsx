import { AppShell, Burger, Group } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { NavBar } from "../NavBar/NavBar"
import { NavBarHeader } from "../NavBar/NavBaHeader"

export function HeaderMobile() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure()
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true)

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "md",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="md" size="sm" />
          <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="md" size="sm" />
          <NavBarHeader />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <NavBar />
      </AppShell.Navbar>
    </AppShell>
  )
}

export default HeaderMobile
