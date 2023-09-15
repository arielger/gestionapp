import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import { UpdatePropertySchema } from "src/properties/schemas"
import getProperty from "src/properties/queries/getProperty"
import updateProperty from "src/properties/mutations/updateProperty"
import { PropertyForm } from "src/properties/components/PropertyForm"

export const EditProperty = () => {
  const router = useRouter()
  const propertyId = useParam("propertyId", "number")
  const [property, { setQueryData }] = useQuery(
    getProperty,
    { id: propertyId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updatePropertyMutation] = useMutation(updateProperty)

  return (
    <>
      <Head>
        <title>Editar Property {property.id}</title>
      </Head>

      <div>
        <h1>Editar Property {property.id}</h1>
        <pre>{JSON.stringify(property, null, 2)}</pre>
        <Suspense fallback={<div>Loading...</div>}>
          <PropertyForm
            submitText="Editar"
            schema={UpdatePropertySchema}
            initialValues={property}
            onSubmit={async (values) => {
              try {
                console.log("values", values)
                const updated = await updatePropertyMutation({
                  id: property.id,
                  ...values,
                })
                console.log("updated", updated)
                await setQueryData(updated)
                await router.push(Routes.ShowPropertyPage({ propertyId: updated.id }))
              } catch (error: any) {
                console.error(error)
                // return {
                //   [FORM_ERROR]: error.toString(),
                // }
              }
            }}
          />
        </Suspense>
      </div>
    </>
  )
}

const EditPropertyPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditProperty />
      </Suspense>

      <p>
        <Link href={Routes.PropertiesPage()}>Propiedades</Link>
      </p>
    </div>
  )
}

EditPropertyPage.authenticate = true
EditPropertyPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditPropertyPage
