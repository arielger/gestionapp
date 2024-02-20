import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import getClient from "src/clients/queries/getClient"
import { PageHeader } from "src/layout/components/PageHeader"
import {
  ActionIcon,
  Anchor,
  Badge,
  Button,
  Center,
  Flex,
  Group,
  Loader,
  Paper,
  Title,
} from "@mantine/core"
import { DetailsList } from "src/core/components/DetailsList"
import { getPersonFullName } from "src/clients/utils"
import { NotFoundError } from "blitz"
import { NotFound } from "src/core/components/NotFound"
import { Prisma } from "db"
import { DataTable, actionsColumnConfig } from "src/core/components/DataTable"
import { PersonList } from "src/clients/components/PersonList"
import { IconCheck, IconEdit, IconEye } from "@tabler/icons-react"
import { getAddressString } from "src/addresses/utils"
import { useClientDelete } from "src/clients/hooks"

const propertyInclude = {
  owners: {
    include: {
      client: true,
    },
  },
  contracts: true,
  address: true,
}

const clientWithPropertiesInclude = {
  // get properties with their owners + client data
  properties: {
    include: {
      property: {
        include: propertyInclude,
      },
    },
  },
  tenantRentContracts: {
    include: {
      contract: {
        include: {
          property: {
            include: propertyInclude,
          },
        },
      },
    },
  },
  address: true,
}

type ClientWithProperties = Prisma.ClientGetPayload<{
  include: typeof clientWithPropertiesInclude
}>

export const Client = () => {
  const router = useRouter()
  const clientId = useParam("clientId", "number")

  const [client, { isLoading: isLoadingClient, error }] = useQuery<
    typeof getClient,
    ClientWithProperties
  >(
    getClient,
    {
      id: clientId,
      include: clientWithPropertiesInclude,
    },
    {
      suspense: false,
      refetchOnWindowFocus: false,
    }
  )

  const { isLoadingDelete, deleteClient } = useClientDelete({
    onSuccess: () => {
      void router.push(Routes.ClientsPage())
    },
  })

  const notFound = (error as NotFoundError)?.name === NotFoundError.name

  if (notFound) {
    return (
      <NotFound
        title="Cliente no encontrado"
        description={
          "No encontramos el cliente que estás buscando.\n Por favor, verificá el ID ingresado"
        }
        goBackRoute={Routes.ClientsPage()}
      />
    )
  }

  if (!clientId) {
    return (
      <NotFound
        title="ID de cliente erroneo"
        description="Ingresa un ID númerico válido para buscar un cliente"
        goBackRoute={Routes.ClientsPage()}
      />
    )
  }

  if (isLoadingClient || !client) {
    return (
      <Center>
        <Loader mt={160} />
      </Center>
    )
  }

  const fullName = getPersonFullName(client)
  const isOwner = client.properties?.length > 0
  const isTenant = client.tenantRentContracts?.length > 0

  const relatedProperties = [
    ...(client.properties ?? []).map((clientProperty) => ({
      ...clientProperty.property,
      role: "OWNER",
    })),
    ...client.tenantRentContracts.map((tenantRentContract) => ({
      ...tenantRentContract.contract.property,
      role: "TENANT",
    })),
  ]

  return (
    <>
      <Head>
        <title>
          Cliente #{client.id} - {fullName}
        </title>
      </Head>

      <div>
        <PageHeader
          title={client ? fullName : "..."}
          afterTitle={
            <Flex gap="xs">
              {isOwner && <Badge color="green">Propietario</Badge>}
              {isTenant && <Badge color="blue">Inquilino</Badge>}
            </Flex>
          }
          breadcrumbs={[
            <Anchor component={Link} href={Routes.ClientsPage()} key="clients">
              Clientes
            </Anchor>,
            <Anchor
              component={Link}
              href={Routes.ShowClientPage({ clientId: client.id })}
              key="clientId"
            >
              #{client.id}
            </Anchor>,
          ]}
        >
          <Flex gap="sm">
            <Link href={Routes.EditClientPage({ clientId: client.id })}>
              <Button>Editar</Button>
            </Link>

            <Button
              color="red"
              type="button"
              onClick={() => deleteClient(clientId)}
              loading={isLoadingDelete}
            >
              Eliminar
            </Button>
          </Flex>
        </PageHeader>
        <Paper shadow="xs" p="lg" mb="lg">
          <DetailsList
            details={[
              {
                title: "Nombre completo",
                value: fullName,
              },
              {
                title: "Email",
                value: client.email ?? "-",
              },
              {
                title: "Dirección",
                value: client.address
                  ? getAddressString({
                      address: client.address,
                    })
                  : "-",
              },
            ]}
          />
        </Paper>

        <Title order={5} fw={"normal"} mb="sm">
          Propiedades relacionadas
        </Title>
        <DataTable
          records={relatedProperties}
          // TODO: Move logic to properties module
          columns={[
            {
              accessor: "id",
              title: "#",
              textAlign: "right",
              width: 60,
            },
            {
              accessor: "address",
              title: "Dirección",
              render: (property) => getAddressString({ address: property.address }),
            },
            {
              accessor: "owners",
              title: "Propietario/s",
              render: (property) => (
                <PersonList list={property.owners.map((owner) => owner.client) ?? []} />
              ),
            },
            {
              accessor: "contract",
              title: "Estado",
              render: (property) =>
                // TODO: review that contract is current
                property.contracts?.length > 0 ? (
                  <Badge
                    leftSection={<IconCheck style={{ width: 10, height: 10 }} />}
                    variant="light"
                    color="green"
                    radius="xs"
                  >
                    Alquilada
                  </Badge>
                ) : (
                  <Badge opacity={0.5} variant="light" color="gray" radius="xs">
                    No alquilada
                  </Badge>
                ),
            },
            {
              accessor: "role",
              title: "Rol",
              render: (clientProperty) => (
                <Badge variant="light" color="blue" radius="xs">
                  {clientProperty.role === "OWNER" ? "Propietario" : "Inquilino"}
                </Badge>
              ),
            },
            {
              ...actionsColumnConfig,
              render: (property) => (
                <Group gap={4} justify="right" wrap="nowrap">
                  <Link href={Routes.ShowPropertyPage({ propertyId: property.id })}>
                    <ActionIcon size="sm" variant="subtle">
                      <IconEye size="1rem" stroke={1.5} />
                    </ActionIcon>
                  </Link>
                  <Link href={Routes.EditPropertyPage({ propertyId: property.id })}>
                    <ActionIcon size="sm" variant="subtle">
                      <IconEdit size="1rem" stroke={1.5} />
                    </ActionIcon>
                  </Link>
                </Group>
              ),
            },
          ]}
        />
      </div>
    </>
  )
}

const ShowClientPage = () => {
  return <Client />
}

ShowClientPage.authenticate = true

export default ShowClientPage
