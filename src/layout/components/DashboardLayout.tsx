import { Header, AppShell, Title } from "@mantine/core"
import { NavigationBar } from "./NavBar"

export const DashboardLayout = ({ children }: { children: React.ReactElement }) => {
  return (
    <AppShell
      padding="lg"
      navbar={<NavigationBar />}
      header={
        <Header height={60} p="xs">
          <Title order={2}>Gestionprop</Title>
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      })}
    >
      {children}
    </AppShell>
  )
}
