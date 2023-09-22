import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import getRealStateOwner from "src/real-state-owners/queries/getRealStateOwner"
import deleteRealStateOwner from "src/real-state-owners/mutations/deleteRealStateOwner"

export const RealStateOwner = () => {
  const router = useRouter()
  const realStateOwnerId = useParam("realStateOwnerId", "number")
  const [deleteRealStateOwnerMutation] = useMutation(deleteRealStateOwner)
  const [realStateOwner] = useQuery(getRealStateOwner, {
    id: realStateOwnerId,
  })

  return (
    <>
      <Head>
        <title>RealStateOwner {realStateOwner.id}</title>
      </Head>

      <div>
        <h1>RealStateOwner {realStateOwner.id}</h1>
        <pre>{JSON.stringify(realStateOwner, null, 2)}</pre>

        <Link
          href={Routes.EditRealStateOwnerPage({
            realStateOwnerId: realStateOwner.id,
          })}
        >
          Edit
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteRealStateOwnerMutation({ id: realStateOwner.id })
              await router.push(Routes.RealStateOwnersPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowRealStateOwnerPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.RealStateOwnersPage()}>RealStateOwners</Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <RealStateOwner />
      </Suspense>
    </div>
  )
}

ShowRealStateOwnerPage.authenticate = true
ShowRealStateOwnerPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowRealStateOwnerPage
