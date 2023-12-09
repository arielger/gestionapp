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
import { Paper } from "@mantine/core"

const NewTenantPage = () => {
  const router = useRouter()
  const [createTenantMutation, { isLoading }] = useMutation(createTenant)

  return (
    <Layout title={"Nuevo inquilino"}>
      <PageHeader title="Crear nuevo inquilino" />
      <Suspense fallback={<div>Loading...</div>}>
        <Paper shadow="xs" p="xl">
          <TenantForm
            submitText="Crear"
            schema={CreateTenantSchema}
            isLoading={isLoading}
            onSubmit={async (values) => {
              const tenant = await createTenantMutation(values)
              await router.push(Routes.ShowTenantPage({ tenantId: tenant.id }))
            }}
          />
        </Paper>
      </Suspense>
      <p>
        <Link href={Routes.TenantsPage()}>Volver</Link>
      </p>
    </Layout>
  )
}

NewTenantPage.authenticate = true

export default NewTenantPage
