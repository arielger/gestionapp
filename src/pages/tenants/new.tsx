import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import { CreateTenantSchema } from "src/tenants/schemas"
import createTenant from "src/tenants/mutations/createTenant"
import { TenantForm } from "src/tenants/components/TenantForm"
import { Suspense } from "react"
import { PageHeader } from "src/layout/components/PageHeader"

const NewTenantPage = () => {
  const router = useRouter()
  const [createTenantMutation] = useMutation(createTenant)

  return (
    <Layout title={"Create New Tenant"}>
      <PageHeader title="Crear nuevo inquilino" />
      <Suspense fallback={<div>Loading...</div>}>
        <TenantForm
          submitText="Create Tenant"
          schema={CreateTenantSchema}
          // initialValues={{}}
          onSubmit={async (values) => {
            try {
              const tenant = await createTenantMutation(values)
              await router.push(Routes.ShowTenantPage({ tenantId: tenant.id }))
            } catch (error: any) {
              console.error(error)
              // return {
              //   [FORM_ERROR]: error.toString(),
              // }
            }
          }}
        />
      </Suspense>
      <p>
        <Link href={Routes.TenantsPage()}>Tenants</Link>
      </p>
    </Layout>
  )
}

NewTenantPage.authenticate = true

export default NewTenantPage
