import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import { Anchor, Button, Flex, Paper, Badge, Center, Loader, Modal } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconCheck } from "@tabler/icons-react"
import { notifications } from "@mantine/notifications"

import Layout from "src/core/layouts/Layout"
import getProperty from "src/properties/queries/getProperty"
import deleteProperty from "src/properties/mutations/deleteProperty"
import { PageHeader } from "src/layout/components/PageHeader"
import { DetailsList } from "src/core/components/DetailsList"
import { PersonList } from "src/real-state-owners/components/PersonList"
import { ActivitiesBalance } from "src/activities/components/ActivitiesBalance"
import { ContractForm } from "src/contracts/components/ContractForm"
import createContract from "src/contracts/mutations/createContract"
import { CreateContractFormSchema } from "src/contracts/schemas"
import { ContractDetails } from "src/contracts/components/ContractDetails"
import { personToSelectItem } from "src/real-state-owners/utils"
import { ContractFeeType } from "@prisma/client"

export const Property = () => {
  const router = useRouter()
  const propertyId = useParam("propertyId", "number")!

  const [property, { isLoading: isLoadingProperty, refetch: refetchProperty }] = useQuery(
    getProperty,
    { id: propertyId },
    {
      suspense: false,
    }
  )

  // TODO: should check date to know if it's rented
  const currentContract = property?.Contract?.[0]

  const [deletePropertyMutation] = useMutation(deleteProperty)

  const [createContractMutation, { isLoading }] = useMutation(createContract)
  const [isCreateContractOpen, { open: openCreateContractModal, close: closeCreateContractModal }] =
    useDisclosure(false)

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
              <Button onClick={openCreateContractModal}>Crear contrato</Button>
            )}
          </Flex>
        </PageHeader>
        <Flex gap="md">
          <Paper shadow="xs" p="xl" style={{ flex: 1 }}>
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
                        handlePress={(id) =>
                          Routes.ShowRealStateOwnerPage({ realStateOwnerId: id })
                        }
                      />
                    ),
                  },
                  ...(currentContract
                    ? [
                        {
                          title: "Estado",
                          value: (
                            <Badge
                              leftSection={<IconCheck style={{ width: 10, height: 10 }} />}
                              variant="light"
                              color="green"
                              radius="xs"
                            >
                              Alquilada
                            </Badge>
                          ),
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
          {currentContract && <ContractDetails contract={currentContract} />}
        </Flex>
        {currentContract && <ActivitiesBalance contractId={currentContract.id} />}
        <Modal
          opened={isCreateContractOpen}
          onClose={closeCreateContractModal}
          title="Crear contrato"
        >
          <ContractForm
            isLoading={isLoading}
            submitText="Crear"
            schema={CreateContractFormSchema}
            ownersInitialValue={property?.owners.map(personToSelectItem)}
            onSubmit={async (values) => {
              if (!property) return

              try {
                await createContractMutation({
                  ...values,
                  propertyId: propertyId,
                  owners: property.owners.map((owner) => owner.id),
                  // transform percentage from presentation (0 to 100) to db representation (0 to 1)
                  fee:
                    values.feeType === ContractFeeType.PERCENTAGE ? values.fee * 0.01 : values.fee,
                })

                closeCreateContractModal()

                notifications.show({
                  title: "Contrato creado exitosamente",
                  message: "",
                  color: "green",
                  icon: <IconCheck />,
                })

                void refetchProperty()
              } catch (error: any) {
                console.error(error)
              }
            }}
          />
        </Modal>
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
