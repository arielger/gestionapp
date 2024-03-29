import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import { CreatePropertyFormSchema } from "src/properties/schemas"
import createProperty from "src/properties/mutations/createProperty"
import { PropertyForm } from "src/properties/components/PropertyForm"
import { Suspense } from "react"
import { PageHeader } from "src/layout/components/PageHeader"
import { Paper } from "@mantine/core"
import { addressFormInitialValue } from "src/addresses/utils"

const NewPropertyPage = () => {
  const router = useRouter()
  const [createPropertyMutation, { isLoading }] = useMutation(createProperty)

  return (
    <Layout title={"Nueva propiedad"}>
      <PageHeader title="Crear nueva propiedad" />
      <Suspense fallback={<div>Loading...</div>}>
        <Paper shadow="xs" p="xl">
          <PropertyForm
            submitText="Crear"
            schema={CreatePropertyFormSchema}
            initialValues={{
              owners: [],
              address: addressFormInitialValue,
            }}
            onSubmit={async (values) => {
              const property = await createPropertyMutation({
                ...values,
                owners: values.owners?.map((o) => Number(o)),
              })
              await router.push(Routes.ShowPropertyPage({ propertyId: property.id }))
            }}
            isLoading={isLoading}
          />
        </Paper>
      </Suspense>
      <p>
        <Link href={Routes.PropertiesPage()}>Volver</Link>
      </p>
    </Layout>
  )
}

NewPropertyPage.authenticate = true

export default NewPropertyPage
