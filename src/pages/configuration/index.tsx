import { useRouter } from "next/router"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { Paper } from "@mantine/core"
import { Organization } from "@prisma/client"
import Head from "next/head"
import Layout from "src/core/layouts/Layout"
import { PageHeader } from "src/layout/components/PageHeader"
import { OrganizationForm } from "src/organizations/components/OrganizationForm"
import updateOrganization from "src/organizations/mutations/updateOrganization"
import getOrganization from "src/organizations/queries/getOrganization"
import { organizationFormEditInitialValues } from "src/organizations/utils"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

const ConfigurationPage = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  const id = currentUser?.memberships?.[0]?.organization.id
  const [organization, { setQueryData }] = useQuery<typeof getOrganization, Organization>(
    getOrganization,
    { id }
  )
  const [updateOrganizationMutation, { isLoading }] = useMutation(updateOrganization)

  return (
    <Layout>
      <Head>
        <title>Configuración</title>
      </Head>

      <div>
        <PageHeader title="Configuración"></PageHeader>
        <Paper shadow="xs" p="xl">
          <OrganizationForm
            isLoading={isLoading}
            submitText="Editar"
            initialValues={organizationFormEditInitialValues(organization)}
            onSubmit={async (values) => {
              const updated = await updateOrganizationMutation({
                ...values,
              })
              await setQueryData(updated)
              router.reload()
            }}
          />
        </Paper>
      </div>
    </Layout>
  )
}

ConfigurationPage.authenticate = true

export default ConfigurationPage
