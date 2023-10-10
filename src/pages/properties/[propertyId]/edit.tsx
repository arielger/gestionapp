import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import { UpdatePropertySchema } from "src/properties/schemas"
import getProperty from "src/properties/queries/getProperty"
import updateProperty from "src/properties/mutations/updateProperty"
import { PropertyForm } from "src/properties/components/PropertyForm"
import { PageHeader } from "src/layout/components/PageHeader"
import { Center, Loader, Paper } from "@mantine/core"
import { personToSelectItem } from "src/real-state-owners/utils"

export const EditProperty = () => {
  const router = useRouter()
  const propertyId = useParam("propertyId", "number")
  const [property, { setQueryData, isLoading: isLoadingProperty }] = useQuery(
    getProperty,
    { id: propertyId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
      suspense: false,
    }
  )
  const [updatePropertyMutation, { isLoading: isLoadingUpdate }] = useMutation(updateProperty)

  const initialValues = {
    ...property,
    address: property?.address ?? "",
    owners: property?.owners ? property.owners.map((owner) => owner.id) : [],
  }

  return (
    <>
      <Head>
        <title>Editar Property {propertyId}</title>
      </Head>

      <div>
        <PageHeader title={`Editar propiedad #${propertyId}`} />
        <Paper shadow="xs" p="xl">
          {isLoadingProperty || !property ? (
            <Center>
              <Loader />
            </Center>
          ) : (
            <PropertyForm
              submitText="Editar"
              schema={UpdatePropertySchema.omit({ id: true })}
              initialValues={initialValues}
              ownersInitialValues={property.owners.map(personToSelectItem)}
              isLoading={isLoadingUpdate}
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
          )}
        </Paper>
      </div>
    </>
  )
}

const EditPropertyPage = () => {
  return (
    <div>
      <EditProperty />

      <p>
        <Link href={Routes.PropertiesPage()}>Volver</Link>
      </p>
    </div>
  )
}

EditPropertyPage.authenticate = true

export default EditPropertyPage
