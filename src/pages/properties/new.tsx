import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import { CreatePropertySchema } from "src/properties/schemas"
import createProperty from "src/properties/mutations/createProperty"
import { PropertyForm } from "src/properties/components/PropertyForm"
import { Suspense } from "react"
import { PageHeader } from "src/layout/components/PageHeader"

const NewPropertyPage = () => {
  const router = useRouter()
  const [createPropertyMutation, { isLoading }] = useMutation(createProperty)

  return (
    <Layout title={"Nueva propiedad"}>
      <PageHeader title="Crear nueva propiedad" />
      <Suspense fallback={<div>Loading...</div>}>
        <PropertyForm
          submitText="Crear"
          schema={CreatePropertySchema}
          initialValues={{
            address: "",
            owners: [],
          }}
          onSubmit={async (values) => {
            try {
              const property = await createPropertyMutation(values)
              await router.push(Routes.ShowPropertyPage({ propertyId: property.id }))
            } catch (error: any) {
              console.error(error)
              // return {
              //   [FORM_ERROR]: error.toString(),
              // }
            }
          }}
          isLoading={isLoading}
        />
      </Suspense>
      <p>
        <Link href={Routes.PropertiesPage()}>Volver</Link>
      </p>
    </Layout>
  )
}

NewPropertyPage.authenticate = true

export default NewPropertyPage
