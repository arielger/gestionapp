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
import { PageHeader } from "src/layout/components/PageHeader"
import { Anchor, Button, Center, Flex, Loader, Paper } from "@mantine/core"
import { DetailsList } from "src/core/components/DetailsList"

export const Tenant = () => {
  const router = useRouter()
  const tenantId = useParam("tenantId", "number")
  const [deleteTenantMutation] = useMutation(deleteTenant)
  const [tenant, { isLoading }] = useQuery(getTenant, { id: tenantId })

  return (
    <>
      <Head>
        <title>Tenant {tenant.id}</title>
      </Head>

      <div>
        <PageHeader
          title={`Inquilino #${tenant.id}`}
          breadcrumbs={[
            <Anchor component={Link} href={Routes.TenantsPage()} key="tenants">
              Inquilinos
            </Anchor>,
            <Anchor
              component={Link}
              href={Routes.ShowTenantPage({ tenantId: tenant.id })}
              key="property"
            >
              #{tenant.id}
            </Anchor>,
          ]}
        >
          <Flex gap="sm">
            <Link href={Routes.EditTenantPage({ tenantId: tenant.id })}>
              <Button>Editar</Button>
            </Link>

            <Button
              color="red"
              type="button"
              onClick={async () => {
                if (window.confirm("This will be deleted")) {
                  await deleteTenantMutation({ id: tenant.id })
                  await router.push(Routes.TenantsPage())
                }
              }}
            >
              Eliminar
            </Button>
          </Flex>
        </PageHeader>
        <Paper shadow="xs" p="xl">
          {/* TODO: Prevent repeating elements with properties table - move to general file */}
          {isLoading || !tenant ? (
            <Center>
              <Loader />
            </Center>
          ) : (
            <DetailsList
              details={[
                {
                  title: "Nombre",
                  value: tenant.firstName,
                },
                {
                  title: "Apellido",
                  value: tenant.lastName,
                },
                {
                  title: "Email",
                  value: tenant.email ?? "-",
                },
              ]}
            />
          )}
        </Paper>
      </div>
    </>
  )
}

const ShowTenantPage = () => {
  return <Tenant />
}

ShowTenantPage.authenticate = true
ShowTenantPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowTenantPage
