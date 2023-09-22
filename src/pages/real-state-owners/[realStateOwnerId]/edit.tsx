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
  const [updateRealStateOwnerMutation] = useMutation(updateRealStateOwner)

  return (
    <>
      <Head>
        <title>Edit RealStateOwner {realStateOwner.id}</title>
      </Head>

      <div>
        <h1>Edit RealStateOwner {realStateOwner.id}</h1>
        <pre>{JSON.stringify(realStateOwner, null, 2)}</pre>
        <Suspense fallback={<div>Loading...</div>}>
          <RealStateOwnerForm
            submitText="Update RealStateOwner"
            schema={UpdateRealStateOwnerSchema.omit({ id: true })}
            initialValues={realStateOwner}
            onSubmit={async (values) => {
              try {
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
              } catch (error: any) {
                console.error(error)
                // return {
                //   [FORM_ERROR]: error.toString(),
                // }
              }
            }}
          />
        </Suspense>
      </div>
    </>
  )
}

const EditRealStateOwnerPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditRealStateOwner />
      </Suspense>

      <p>
        <Link href={Routes.RealStateOwnersPage()}>RealStateOwners</Link>
      </p>
    </div>
  )
}

EditRealStateOwnerPage.authenticate = true
EditRealStateOwnerPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditRealStateOwnerPage
