import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import { CreatePropertyFormSchema } from "src/properties/schemas"
import getProperty from "src/properties/queries/getProperty"
import updateProperty from "src/properties/mutations/updateProperty"
import { PropertyForm } from "src/properties/components/PropertyForm"
import { PageHeader } from "src/layout/components/PageHeader"
import { Center, Loader, Paper } from "@mantine/core"
import { personToSelectItem } from "src/clients/utils"
import { NotFound } from "src/core/components/NotFound"
import { NotFoundError } from "blitz"
import { mapAddressToFormInitialValues } from "src/addresses/utils"

export const EditProperty = () => {
  const router = useRouter()
  const propertyId = useParam("propertyId", "number")
  const [property, { isLoading: isLoadingProperty, error, setQueryData }] = useQuery(
    getProperty,
    { id: propertyId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
      suspense: false,
    }
  )
  const [updatePropertyMutation, { isLoading: isLoadingUpdate }] = useMutation(updateProperty)

  const notFound = (error as NotFoundError)?.name === NotFoundError.name

  if (notFound) {
    return (
      <NotFound
        title="Propiedad no encontrada"
        description={
          "No encontramos la propiedad que estás buscando.\n Por favor, verificá el ID ingresado"
        }
        goBackRoute={Routes.PropertiesPage()}
      />
    )
  }

  const propertyOwnersClients = property?.owners.map((owner) => owner.client) ?? []

  // TODO: Fix property edit - form errors not working properly
  return (
    <>
      <Head>
        <title>Editar propiedad {propertyId}</title>
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
              schema={CreatePropertyFormSchema}
              initialValues={{
                ...property,
                address: mapAddressToFormInitialValues(property.address),
                owners: propertyOwnersClients?.map((client) => String(client.id)),
              }}
              ownersInitialValues={propertyOwnersClients.map(personToSelectItem)}
              isLoading={isLoadingUpdate}
              onSubmit={async (values) => {
                const updated = await updatePropertyMutation({
                  id: property.id,
                  ...values,
                  owners: values.owners?.map((o) => Number(o)),
                })
                await setQueryData(updated)
                await router.push(Routes.ShowPropertyPage({ propertyId: updated.id }))
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

      <Link href={Routes.PropertiesPage()}>Volver</Link>
    </div>
  )
}

EditPropertyPage.authenticate = true

export default EditPropertyPage
