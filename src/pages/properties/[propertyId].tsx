import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import { Anchor, Button, Flex, Text, Paper, Badge, Center, Loader } from "@mantine/core"
import { IconCheck, IconExternalLink } from "@tabler/icons-react"

import Layout from "src/core/layouts/Layout"
import getProperty from "src/properties/queries/getProperty"
import deleteProperty from "src/properties/mutations/deleteProperty"
import { PageHeader } from "src/layout/components/PageHeader"
import { DetailsList } from "src/core/components/DetailsList"

export const Property = () => {
  const router = useRouter()
  const propertyId = useParam("propertyId", "number")!
  const [deletePropertyMutation] = useMutation(deleteProperty)
  const [property, { isLoading }] = useQuery(
    getProperty,
    { id: propertyId },
    {
      suspense: false,
    }
  )

  return (
    <>
      <Head>
        <title>Propiedad {propertyId}</title>
      </Head>

      <div>
        <PageHeader
          title={property?.address ?? "..."}
          breadcrumbs={[
            <Anchor component={Link} href={Routes.PropertiesPage()} key="properties">
              Propiedades
            </Anchor>,
            <Anchor
              component={Link}
              href={Routes.ShowPropertyPage({ propertyId: propertyId })}
              key="property"
            >
              #{propertyId}
            </Anchor>,
          ]}
        >
          <Flex gap="sm">
            <Link href={Routes.EditPropertyPage({ propertyId: propertyId })}>
              <Button>Editar</Button>
            </Link>

            <Button
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
            </Button>

            {!property?.Contract?.length && (
              <Link href={Routes.NewContractPage({ propertyId: propertyId })}>
                <Button>Crear contrato</Button>
              </Link>
            )}
          </Flex>
        </PageHeader>
        <Paper shadow="xs" p="xl">
          {/* TODO: Prevent repeating elements with properties table - move to general file */}
          {isLoading || !property ? (
            <Center>
              <Loader />
            </Center>
          ) : (
            <DetailsList
              details={[
                { title: "Dirección", value: property.address },
                {
                  title: "Fecha de creación",
                  value: property.createdAt.toLocaleDateString(),
                },
                {
                  title: "Propietario/s",
                  value:
                    property.owners.length > 0 ? (
                      <Flex direction="column" gap={4}>
                        {property.owners.map((owner) => (
                          <Anchor
                            color="black"
                            key={owner.id}
                            size="sm"
                            component={Link}
                            href={Routes.ShowRealStateOwnerPage({ realStateOwnerId: owner.id })}
                          >
                            <Flex align="center" gap={4}>
                              <Text size="md">{`${owner.firstName} ${owner.lastName}`}</Text>
                              <IconExternalLink color="gray" size={16} />
                            </Flex>
                          </Anchor>
                        ))}
                      </Flex>
                    ) : (
                      <Text size="md">No asignado</Text>
                    ),
                },
                {
                  title: "Estado",
                  value:
                    property?.Contract?.length > 0 ? (
                      <Anchor
                        size="sm"
                        component={Link}
                        href={Routes.ShowContractPage({
                          propertyId: property.id,
                          contractId: property.Contract[0]!.id,
                        })}
                      >
                        <Badge
                          leftSection={<IconCheck style={{ width: 10, height: 10 }} />}
                          variant="light"
                          color="green"
                          radius="xs"
                        >
                          Alquilada
                        </Badge>
                      </Anchor>
                    ) : (
                      <Badge opacity={0.5} variant="light" color="gray" radius="xs">
                        No alquilada
                      </Badge>
                    ),
                },
              ]}
            />
          )}
        </Paper>
      </div>
    </>
  )
}

const ShowPropertyPage = () => {
  return <Property />
}

ShowPropertyPage.authenticate = true
ShowPropertyPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowPropertyPage
