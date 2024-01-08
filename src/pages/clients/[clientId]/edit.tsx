import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import { UpdateClientSchema } from "src/clients/schemas"
import getClient from "src/clients/queries/getClient"
import updateClient from "src/clients/mutations/updateClient"
import { ClientForm } from "src/clients/components/ClientForm"
import { Paper } from "@mantine/core"
import { PageHeader } from "src/layout/components/PageHeader"

// TODO: move to edit modal

export const EditClient = () => {
  const router = useRouter()
  const clientId = useParam("clientId", "number")
  const [client, { setQueryData }] = useQuery(
    getClient,
    { id: clientId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateClientMutation, { isLoading }] = useMutation(updateClient)

  return (
    <>
      <Head>
        <title>Editar cliente #{client.id}</title>
      </Head>

      <div>
        <PageHeader title={`Editar cliente #${client.id}`} />
        <Suspense fallback={<div>Loading...</div>}>
          <Paper shadow="xs" p="xl">
            <ClientForm
              isLoading={isLoading}
              submitText="Editar"
              schema={UpdateClientSchema.omit({ id: true })}
              initialValues={client}
              onSubmit={async (values) => {
                const updated = await updateClientMutation({
                  id: client.id,
                  ...values,
                })
                await setQueryData(updated)
                await router.push(Routes.ShowClientPage({ clientId: updated.id }))
              }}
            />
          </Paper>
        </Suspense>
      </div>
    </>
  )
}

const EditClientPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditClient />
      </Suspense>

      <p>
        <Link href={Routes.ClientsPage()}>Volver</Link>
      </p>
    </div>
  )
}

EditClientPage.authenticate = true

export default EditClientPage
