import { Suspense } from "react"
import Link from "next/link"
import Layout from "src/core/layouts/Layout"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { Routes, BlitzPage } from "@blitzjs/next"
import { Flex, Title, Button, Container, Text } from "@mantine/core"
import { NavigationBar } from "src/layout/components/NavBar"
import { DashboardLayout } from "src/layout/components/DashboardLayout"

const UserInfo = () => {
  const currentUser = useCurrentUser()

  console.log("currentUser", currentUser)

  if (currentUser) {
    return <DashboardLayout />
  } else {
    return (
      <>
        <Title order={1}>Gestionprop</Title>
        <Text>Sistema de gestión de alquileres</Text>
        <Flex gap="md">
          <Button size="md" component={Link} href={Routes.SignupPage()}>
            Crea tu cuenta
          </Button>
          <Button size="md" variant="light" component={Link} href={Routes.LoginPage()}>
            Ingresá
          </Button>
        </Flex>
      </>
    )
  }
}

const Home: BlitzPage = () => {
  return (
    <Layout title="Gestionprop">
      <Suspense fallback="Loading...">
        <UserInfo />
      </Suspense>
    </Layout>
  )
}

export default Home
