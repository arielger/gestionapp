import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
// import { useRouter } from "next/router"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import getRealStateOwner from "src/real-state-owners/queries/getRealStateOwner"
// import deleteRealStateOwner from "src/real-state-owners/mutations/deleteRealStateOwner"
import { PageHeader } from "src/layout/components/PageHeader"
import { getPersonFullName } from "src/real-state-owners/utils"
import { Anchor, Button, Center, Flex, Loader, Paper } from "@mantine/core"
import { DetailsList } from "src/core/components/DetailsList"

export const RealStateOwner = () => {
  // const router = useRouter()
  const realStateOwnerId = useParam("realStateOwnerId", "number")!
  // const [deleteRealStateOwnerMutation] = useMutation(deleteRealStateOwner)
  const [realStateOwner, { isLoading }] = useQuery(
    getRealStateOwner,
    {
      id: realStateOwnerId,
    },
    {
      suspense: false,
    }
  )

  return (
    <>
      <Head>
        <title>
          Propietario #{realStateOwnerId}{" "}
          {realStateOwner ? `(${getPersonFullName(realStateOwner)})` : ""}
        </title>
      </Head>

      <div>
        <PageHeader
          title={realStateOwner ? getPersonFullName(realStateOwner) : "..."}
          breadcrumbs={[
            <Anchor component={Link} href={Routes.PropertiesPage()} key="properties">
              Propietarios
            </Anchor>,
            <Anchor
              component={Link}
              href={Routes.ShowRealStateOwnerPage({ realStateOwnerId: realStateOwnerId })}
              key="property"
            >
              #{realStateOwnerId}
            </Anchor>,
          ]}
        >
          <Flex gap="sm">
            <Link href={Routes.EditRealStateOwnerPage({ realStateOwnerId: realStateOwnerId })}>
              <Button>Editar</Button>
            </Link>

            {/* <Button
              color="red"
              type="button"
              onClick={async () => {
                if (window.confirm("This will be deleted")) {
                  await deletePropertyMutation({ id: propertyId })
                  await router.push(Routes.PropertiesPage())
                }
              }}
            >
              Eliminar
            </Button> */}
          </Flex>
        </PageHeader>

        <Paper shadow="xs" p="xl">
          {isLoading || !realStateOwner ? (
            <Center>
              <Loader />
            </Center>
          ) : (
            <DetailsList
              details={[
                // TODO: this can be moved to a general person data
                { title: "Nombre", value: realStateOwner.firstName },
                {
                  title: "Apellido",
                  value: realStateOwner.lastName,
                },
                {
                  title: "Email",
                  value: realStateOwner.email ?? "-",
                },
              ]}
            />
          )}
        </Paper>
      </div>
    </>
  )
}

const ShowRealStateOwnerPage = () => {
  return <RealStateOwner />
}

ShowRealStateOwnerPage.authenticate = true

export default ShowRealStateOwnerPage
