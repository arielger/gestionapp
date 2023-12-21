import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import getClient from "src/clients/queries/getClient"
import deleteClient from "src/clients/mutations/deleteClient"
import { PageHeader } from "src/layout/components/PageHeader"
import { Anchor, Button, Center, Flex, Loader, Paper } from "@mantine/core"
import { DetailsList } from "src/core/components/DetailsList"
import { getPersonFullName } from "src/clients/utils"

export const Client = () => {
  const router = useRouter()
  const clientId = useParam("clientId", "number")

  const [deleteClientMutation] = useMutation(deleteClient)
  const [client, { isLoading }] = useQuery(getClient, { id: clientId })

  const fullName = getPersonFullName(client)

  // TODO: add type of client (owner / tenant)

  return (
    <>
      <Head>
        <title>
          Cliente #{client.id} {client ? `(${fullName})` : ""}
        </title>
      </Head>

      <div>
        <PageHeader
          title={client ? fullName : "..."}
          breadcrumbs={[
            <Anchor component={Link} href={Routes.ClientsPage()} key="clients">
              Clientes
            </Anchor>,
            <Anchor
              component={Link}
              href={Routes.ShowClientPage({ clientId: client.id })}
              key="clientId"
            >
              #{client.id}
            </Anchor>,
          ]}
        >
          <Flex gap="sm">
            <Link href={Routes.EditClientPage({ clientId: client.id })}>
              <Button>Editar</Button>
            </Link>

            <Button
              color="red"
              type="button"
              onClick={async () => {
                if (window.confirm("This will be deleted")) {
                  await deleteClientMutation({ id: client.id })
                  await router.push(Routes.ClientsPage())
                }
              }}
            >
              Eliminar
            </Button>
          </Flex>
        </PageHeader>
        <Paper shadow="xs" p="lg">
          {isLoading || !client ? (
            <Center>
              <Loader />
            </Center>
          ) : (
            <DetailsList
              details={[
                {
                  title: "Nombre completo",
                  value: fullName,
                },
                {
                  title: "Email",
                  value: client.email ?? "-",
                },
              ]}
            />
          )}
        </Paper>
      </div>
    </>
  )
}

const ShowClientPage = () => {
  return <Client />
}

ShowClientPage.authenticate = true
ShowClientPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowClientPage
