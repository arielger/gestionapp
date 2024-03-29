import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import { UpdateClientSchema } from "src/clients/schemas"
import getClient from "src/clients/queries/getClient"
import updateClient from "src/clients/mutations/updateClient"
import { ClientForm } from "src/clients/components/ClientForm"
import { Paper } from "@mantine/core"
import { PageHeader } from "src/layout/components/PageHeader"
import { ClientWithAddress, clientWithAddressInclude } from "src/clients/types"
import { clientFormEditInitialValues } from "src/clients/utils"

// TODO: move to edit modal

export const EditClient = () => {
  const router = useRouter()
  const clientId = useParam("clientId", "number")
  const [client, { setQueryData }] = useQuery<typeof getClient, ClientWithAddress>(
    getClient,
    { id: clientId, include: clientWithAddressInclude },
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
              initialValues={clientFormEditInitialValues(client)}
              onSubmit={async (values) => {
                const updated = await updateClientMutation({
                  id: client.id,
                  addressId: client.addressId,
                  ...values,
                })
                await setQueryData(updated)
                await router.push(Routes.ShowClientPage({ clientId: updated.id }))
              }}
            />
          </Paper>
        </Suspense>
      </div>

      <p>
        <Link href={Routes.ShowClientPage({ clientId: String(clientId) })}>Volver</Link>
      </p>
    </>
  )
}

const EditClientPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditClient />
      </Suspense>
    </div>
  )
}

EditClientPage.authenticate = true

export default EditClientPage
