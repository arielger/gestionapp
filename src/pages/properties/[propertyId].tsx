import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import getProperty from "src/properties/queries/getProperty"
import deleteProperty from "src/properties/mutations/deleteProperty"
import { Button, Flex, Text } from "@mantine/core"

export const Property = () => {
  const router = useRouter()
  const propertyId = useParam("propertyId", "number")
  const [deletePropertyMutation] = useMutation(deleteProperty)
  const [property] = useQuery(getProperty, { id: propertyId })

  return (
    <>
      <Head>
        <title>Propiedad {property.id}</title>
      </Head>

      <div>
        <h1>Propiedad #{property.id}</h1>
        <Flex gap="md" direction="column">
          <Flex direction="column">
            <Text size="sm" color={"gray.7"}>
              Dirección
            </Text>
            <Text size="md">{property.address}</Text>
          </Flex>

          <Flex direction="column">
            <Text size="sm" color={"gray.7"}>
              Fecha de creación
            </Text>
            <Text size="md">{property.createdAt.toLocaleDateString()}</Text>
          </Flex>

          <Flex gap="sm">
            <Link href={Routes.EditPropertyPage({ propertyId: property.id })}>
              <Button>Editar</Button>
            </Link>

            <Button
              color="red"
              type="button"
              onClick={async () => {
                if (window.confirm("This will be deleted")) {
                  await deletePropertyMutation({ id: property.id })
                  await router.push(Routes.PropertiesPage())
                }
              }}
            >
              Eliminar
            </Button>
          </Flex>
        </Flex>
      </div>
    </>
  )
}

const ShowPropertyPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.PropertiesPage()}>Volver</Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Property />
      </Suspense>
    </div>
  )
}

ShowPropertyPage.authenticate = true
ShowPropertyPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowPropertyPage
