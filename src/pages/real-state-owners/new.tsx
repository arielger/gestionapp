import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import { CreateRealStateOwnerSchema } from "src/real-state-owners/schemas"
import createRealStateOwner from "src/real-state-owners/mutations/createRealStateOwner"
import { RealStateOwnerForm } from "src/real-state-owners/components/RealStateOwnerForm"
import { Suspense } from "react"
import { Paper } from "@mantine/core"
import { PageHeader } from "src/layout/components/PageHeader"

const NewRealStateOwnerPage = () => {
  const router = useRouter()
  const [createRealStateOwnerMutation, { isLoading }] = useMutation(createRealStateOwner)

  return (
    <Layout title={"Nuevo propietario"}>
      <PageHeader title="Crear nuevo propietario" />
      <Suspense fallback={<div>Loading...</div>}>
        <Paper shadow="xs" p="xl">
          <RealStateOwnerForm
            submitText="Crear"
            schema={CreateRealStateOwnerSchema}
            // initialValues={{}}
            isLoading={isLoading}
            onSubmit={async (values) => {
              try {
                const realStateOwner = await createRealStateOwnerMutation(values)
                await router.push(
                  Routes.ShowRealStateOwnerPage({
                    realStateOwnerId: realStateOwner.id,
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
        </Paper>
      </Suspense>
      <p>
        <Link href={Routes.RealStateOwnersPage()}>Volver</Link>
      </p>
    </Layout>
  )
}

NewRealStateOwnerPage.authenticate = true

export default NewRealStateOwnerPage
