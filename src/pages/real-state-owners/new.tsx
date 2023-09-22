import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import { CreateRealStateOwnerSchema } from "src/real-state-owners/schemas"
import createRealStateOwner from "src/real-state-owners/mutations/createRealStateOwner"
import { RealStateOwnerForm } from "src/real-state-owners/components/RealStateOwnerForm"
import { Suspense } from "react"

const NewRealStateOwnerPage = () => {
  const router = useRouter()
  const [createRealStateOwnerMutation] = useMutation(createRealStateOwner)

  return (
    <Layout title={"Nuevo propietario"}>
      <h1>Crear nuevo propietario</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <RealStateOwnerForm
          submitText="Crear"
          schema={CreateRealStateOwnerSchema}
          // initialValues={{}}
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
      </Suspense>
      <p>
        <Link href={Routes.RealStateOwnersPage()}>Volver</Link>
      </p>
    </Layout>
  )
}

NewRealStateOwnerPage.authenticate = true

export default NewRealStateOwnerPage
