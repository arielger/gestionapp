import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import getTenant from "src/tenants/queries/getTenant"
import deleteTenant from "src/tenants/mutations/deleteTenant"

export const Tenant = () => {
  const router = useRouter()
  const tenantId = useParam("tenantId", "number")
  const [deleteTenantMutation] = useMutation(deleteTenant)
  const [tenant] = useQuery(getTenant, { id: tenantId })

  return (
    <>
      <Head>
        <title>Tenant {tenant.id}</title>
      </Head>

      <div>
        <h1>Tenant {tenant.id}</h1>
        <pre>{JSON.stringify(tenant, null, 2)}</pre>

        <Link href={Routes.EditTenantPage({ tenantId: tenant.id })}>Edit</Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteTenantMutation({ id: tenant.id })
              await router.push(Routes.TenantsPage())
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

const ShowTenantPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.TenantsPage()}>Tenants</Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Tenant />
      </Suspense>
    </div>
  )
}

ShowTenantPage.authenticate = true
ShowTenantPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowTenantPage
