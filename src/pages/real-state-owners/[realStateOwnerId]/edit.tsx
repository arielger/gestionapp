import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import { UpdateRealStateOwnerSchema } from "src/real-state-owners/schemas"
import getRealStateOwner from "src/real-state-owners/queries/getRealStateOwner"
import updateRealStateOwner from "src/real-state-owners/mutations/updateRealStateOwner"
import { RealStateOwnerForm } from "src/real-state-owners/components/RealStateOwnerForm"
import { PageHeader } from "src/layout/components/PageHeader"
import { Paper } from "@mantine/core"

export const EditRealStateOwner = () => {
  const router = useRouter()
  const realStateOwnerId = useParam("realStateOwnerId", "number")
  const [realStateOwner, { setQueryData }] = useQuery(
    getRealStateOwner,
    { id: realStateOwnerId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateRealStateOwnerMutation, { isLoading: isLoadingUpdate }] =
    useMutation(updateRealStateOwner)

  return (
    <>
      <Head>
        <title>Editar propietario #{realStateOwner.id}</title>
      </Head>

      <div>
        <PageHeader title={`Editar propietario #${realStateOwner.id}`} />
        <Suspense fallback={<div>Loading...</div>}>
          <Paper shadow="xs" p="xl">
            <RealStateOwnerForm
              isLoading={isLoadingUpdate}
              submitText="Editar"
              schema={UpdateRealStateOwnerSchema.omit({ id: true })}
              initialValues={realStateOwner}
              onSubmit={async (values) => {
                const updated = await updateRealStateOwnerMutation({
                  id: realStateOwner.id,
                  ...values,
                })
                await setQueryData(updated)
                await router.push(
                  Routes.ShowRealStateOwnerPage({
                    realStateOwnerId: updated.id,
                  })
                )
              }}
            />
          </Paper>
        </Suspense>
      </div>
    </>
  )
}

const EditRealStateOwnerPage = () => {
  return (
    <div>
      <EditRealStateOwner />

      <p>
        <Link href={Routes.RealStateOwnersPage()}>Volver</Link>
      </p>
    </div>
  )
}

EditRealStateOwnerPage.authenticate = true
EditRealStateOwnerPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditRealStateOwnerPage
