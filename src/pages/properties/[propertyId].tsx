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
import { Button } from "@mantine/core"

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
        <pre>{JSON.stringify(property, null, 2)}</pre>

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
          style={{ marginLeft: "0.5rem" }}
        >
          Eliminar
        </Button>
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
