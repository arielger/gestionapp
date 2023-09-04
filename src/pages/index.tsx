import { Suspense } from "react"
import Link from "next/link"
import Layout from "src/core/layouts/Layout"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import logout from "src/auth/mutations/logout"
import { useMutation } from "@blitzjs/rpc"
import { Routes, BlitzPage } from "@blitzjs/next"
import { Flex, Title, Button, Container, Text } from "@mantine/core"

const UserInfo = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  if (currentUser) {
    return (
      <>
        <button
          onClick={async () => {
            await logoutMutation()
          }}
        >
          Logout
        </button>
        <div>
          User id: <code>{currentUser.id}</code>
          <br />
          User role: <code>{currentUser.role}</code>
        </div>
      </>
    )
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
        <Container>
          <UserInfo />
        </Container>
      </Suspense>
    </Layout>
  )
}

export default Home
