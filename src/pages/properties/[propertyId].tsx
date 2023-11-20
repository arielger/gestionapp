import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import { Anchor, Button, Flex, Paper, Badge, Center, Loader } from "@mantine/core"
import { IconCheck } from "@tabler/icons-react"

import Layout from "src/core/layouts/Layout"
import getProperty from "src/properties/queries/getProperty"
import deleteProperty from "src/properties/mutations/deleteProperty"
import { PageHeader } from "src/layout/components/PageHeader"
import { DetailsList } from "src/core/components/DetailsList"
import { PersonList } from "src/real-state-owners/components/PersonList"
import { ActivitiesBalance } from "src/activities/components/ActivitiesBalance"

export const Property = () => {
  const router = useRouter()
  const propertyId = useParam("propertyId", "number")!

  const [property, { isLoading: isLoadingProperty }] = useQuery(
    getProperty,
    { id: propertyId },
    {
      suspense: false,
    }
  )

  // TODO: should check date to know if it's rented
  const currentContract = property?.Contract?.[0]

  const [deletePropertyMutation] = useMutation(deleteProperty)

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
          {isLoadingProperty || !property ? (
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
                  value: (
                    <PersonList
                      list={property.owners ?? []}
                      handlePress={(id) => Routes.ShowRealStateOwnerPage({ realStateOwnerId: id })}
                    />
                  ),
                },
                ...(currentContract
                  ? [
                      {
                        title: "Estado",
                        value: (
                          <Anchor
                            size="sm"
                            component={Link}
                            href={Routes.ShowContractPage({
                              propertyId: property.id,
                              contractId: currentContract.id,
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
                        ),
                      },
                      {
                        title: "Inquilino/s",
                        value: (
                          <PersonList
                            list={currentContract.tenants ?? []}
                            handlePress={(id) => Routes.ShowTenantPage({ tenantId: id })}
                          />
                        ),
                      },
                      {
                        title: "Inicio",
                        value: currentContract.startDate.toLocaleString(),
                      },
                      {
                        title: "Fin",
                        value: currentContract.startDate.toLocaleString(),
                      },
                      {
                        title: "Periodos",
                        value: currentContract.periods,
                      },
                      {
                        title: "Monto",
                        value: new Intl.NumberFormat().format(currentContract.rentAmount),
                      },
                    ]
                  : [
                      {
                        title: "Estado",
                        value: (
                          <Badge opacity={0.5} variant="light" color="gray" radius="xs">
                            No alquilada
                          </Badge>
                        ),
                      },
                    ]),
              ]}
            />
          )}
        </Paper>
        {currentContract && <ActivitiesBalance contractId={currentContract.id} />}
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
