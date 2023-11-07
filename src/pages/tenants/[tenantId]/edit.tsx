import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import { UpdateTenantSchema } from "src/tenants/schemas"
import getTenant from "src/tenants/queries/getTenant"
import updateTenant from "src/tenants/mutations/updateTenant"
import { TenantForm } from "src/tenants/components/TenantForm"
import { Paper } from "@mantine/core"
import { PageHeader } from "src/layout/components/PageHeader"

export const EditTenant = () => {
  const router = useRouter()
  const tenantId = useParam("tenantId", "number")
  const [tenant, { setQueryData }] = useQuery(
    getTenant,
    { id: tenantId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateTenantMutation, { isLoading }] = useMutation(updateTenant)

  return (
    <>
      <Head>
        <title>Editar inquilino #{tenant.id}</title>
      </Head>

      <div>
        <PageHeader title={`Editar inquilino #${tenant.id}`} />
        <Suspense fallback={<div>Loading...</div>}>
          <Paper shadow="xs" p="xl">
            <TenantForm
              isLoading={isLoading}
              submitText="Editar"
              schema={UpdateTenantSchema.omit({ id: true })}
              initialValues={tenant}
              onSubmit={async (values) => {
                try {
                  const updated = await updateTenantMutation({
                    id: tenant.id,
                    ...values,
                  })
                  await setQueryData(updated)
                  await router.push(Routes.ShowTenantPage({ tenantId: updated.id }))
                } catch (error: any) {
                  console.error(error)
                  // return {
                  //   [FORM_ERROR]: error.toString(),
                  // }
                }
              }}
            />
          </Paper>
        </Suspense>
      </div>
    </>
  )
}

const EditTenantPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditTenant />
      </Suspense>

      <p>
        <Link href={Routes.TenantsPage()}>Volver</Link>
      </p>
    </div>
  )
}

EditTenantPage.authenticate = true
EditTenantPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditTenantPage
