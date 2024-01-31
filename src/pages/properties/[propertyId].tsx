import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import { NotFoundError } from "blitz"
import { Anchor, Button, Flex, Paper, Badge, Center, Loader, Modal } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconCheck } from "@tabler/icons-react"
import { notifications } from "@mantine/notifications"

import getProperty from "src/properties/queries/getProperty"
import deleteProperty from "src/properties/mutations/deleteProperty"
import { PageHeader } from "src/layout/components/PageHeader"
import { DetailsList } from "src/core/components/DetailsList"
import { PersonList } from "src/clients/components/PersonList"
import { ActivitiesBalance } from "src/activities/components/ActivitiesBalance"
import { ContractForm } from "src/contracts/components/ContractForm"
import createContract from "src/contracts/mutations/createContract"
import { CreateContractFormSchema } from "src/contracts/schemas"
import { ContractDetails } from "src/contracts/components/ContractDetails"
import { personToSelectItem } from "src/clients/utils"
import { ContractFeeType } from "@prisma/client"
import { NotFound } from "src/core/components/NotFound"
import { getCurrentContract } from "src/contracts/utils/utils"
import { getAddressString } from "src/properties/utils"

export const Property = () => {
  const router = useRouter()
  const propertyId = useParam("propertyId", "number")!

  const [property, { isLoading: isLoadingProperty, refetch: refetchProperty, error }] = useQuery(
    getProperty,
    { id: propertyId },
    {
      suspense: false,
      refetchOnWindowFocus: false,
    }
  )

  const notFound = (error as NotFoundError)?.name === NotFoundError.name

  const currentContract = getCurrentContract(property?.contracts ?? [])

  const [deletePropertyMutation] = useMutation(deleteProperty)

  const [createContractMutation, { isLoading }] = useMutation(createContract)
  const [isCreateContractOpen, { open: openCreateContractModal, close: closeCreateContractModal }] =
    useDisclosure(false)

  const propertyOwnersClients = property?.owners.map((owner) => owner.client) ?? []

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

  if (isLoadingProperty || !property) {
    return (
      <Center>
        <Loader mt={160} />
      </Center>
    )
  }

  return (
    <>
      <Head>
        <title>Propiedad {propertyId}</title>
      </Head>

      <div>
        <PageHeader
          title={getAddressString({ address: property.address })}
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

            {/* TODO: review - not working */}
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

            {!property?.contracts?.length && (
              <Button onClick={openCreateContractModal}>Crear contrato</Button>
            )}
          </Flex>
        </PageHeader>
        <Flex gap="md">
          <Paper shadow="xs" p="xl" style={{ flex: 1 }}>
            {/* TODO: Prevent repeating elements with properties table - move to general file */}
            <DetailsList
              details={[
                {
                  title: "Dirección",
                  value: getAddressString({
                    address: property.address,
                    withCityDetails: true,
                  }),
                },
                {
                  title: "Fecha de creación",
                  value: property.createdAt.toLocaleDateString(),
                },
                {
                  title: "Propietario/s",
                  value: <PersonList list={propertyOwnersClients ?? []} />,
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
          </Paper>
          {currentContract && <ContractDetails contract={currentContract} />}
        </Flex>
        {currentContract && <ActivitiesBalance contract={currentContract} />}
        <Modal
          opened={isCreateContractOpen}
          onClose={closeCreateContractModal}
          title="Crear contrato"
        >
          <ContractForm
            isLoading={isLoading}
            submitText="Crear"
            schema={CreateContractFormSchema}
            ownersInitialValue={propertyOwnersClients.map((client) => personToSelectItem(client))}
            onSubmit={async (values) => {
              if (!property) return

              await createContractMutation({
                ...values,
                propertyId: propertyId,
                owners: propertyOwnersClients.map((client) => client.id),
                // transform percentage from presentation (0 to 100) to db representation (0 to 1)
                fee: values.feeType === ContractFeeType.PERCENTAGE ? values.fee * 0.01 : values.fee,
              })

              closeCreateContractModal()

              notifications.show({
                title: "Contrato creado exitosamente",
                message: "",
                color: "green",
                icon: <IconCheck />,
              })

              void refetchProperty()
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

export default ShowPropertyPage
