import { Suspense, useEffect, useState } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useMutation } from "@blitzjs/rpc"
import { ActionIcon, Button, Group, SegmentedControl, Flex, Modal } from "@mantine/core"
import { IconEdit, IconTrash, IconEye } from "@tabler/icons-react"
import { z } from "zod"
import { StringParam, withDefault, useQueryParams } from "use-query-params"
import { IconCheck } from "@tabler/icons-react"
import { useRouter } from "next/router"

import { DataTable, actionsColumnConfig } from "src/core/components/DataTable"
import Layout from "src/core/layouts/Layout"
import getClients from "src/clients/queries/getClients"
import { usePaginatedTable } from "src/core/hooks/usePaginatedTable"
import { PageHeader } from "src/layout/components/PageHeader"
import { useDisclosure } from "@mantine/hooks"
import { ClientForm } from "src/clients/components/ClientForm"
import createClient from "src/clients/mutations/createClient"
import { CreateClientSchema } from "src/clients/schemas"
import { notifications } from "@mantine/notifications"
import { Client } from "@prisma/client"
import updateClient from "src/clients/mutations/updateClient"

const listTypes = ["all", "owners", "tenants"] as const

export const ClientsList = ({
  type,
  openEditClient,
}: {
  type: (typeof listTypes)[number]
  openEditClient: (client: Client) => void
}) => {
  // TODO: add search by name
  const { tableProps } = usePaginatedTable({
    query: getClients,
    queryParams: { type },
  })

  return (
    <DataTable
      {...tableProps}
      columns={[
        {
          accessor: "id",
          title: "#",
          textAlign: "right" as const,
          width: 60,
        },
        { accessor: "firstName", title: "Nombre", width: 200 },
        { accessor: "lastName", title: "Apellido", width: 200 },
        { accessor: "email", title: "Email", width: 200 },
        {
          ...actionsColumnConfig,
          render: (client) => (
            <Group gap={4} justify="right" wrap="nowrap">
              <Link href={Routes.ShowClientPage({ clientId: client.id })}>
                <ActionIcon size="sm" variant="subtle">
                  <IconEye size="1rem" stroke={1.5} />
                </ActionIcon>
              </Link>
              <ActionIcon onClick={() => openEditClient(client)} size="sm" variant="subtle">
                <IconEdit size="1rem" stroke={1.5} />
              </ActionIcon>
              <ActionIcon size="sm" variant="subtle" color="red">
                <IconTrash size="1rem" stroke={1.5} />
              </ActionIcon>
            </Group>
          ),
        },
      ]}
    />
  )
}

export const ClientsRouterQuerySchema = z.object({
  type: z.enum(listTypes).optional(),
})

const ClientsPage = () => {
  const router = useRouter()
  const [query, setQuery] = useQueryParams({
    type: withDefault(StringParam, ""),
  })

  useEffect(() => {
    const queryWithValidation = ClientsRouterQuerySchema.safeParse(query)
    if (!queryWithValidation.success) {
      setQuery({}, "replace")
    }
  }, [query, setQuery])

  const [isCreateClientOpen, { open: openCreateClientModal, close: closeCreateClientModal }] =
    useDisclosure(false)
  const [createClientMutation, { isLoading }] = useMutation(createClient)

  const [clientToEdit, setClientToEdit] = useState<Client | undefined>()
  const [updateClientMutation, { isLoading: isLoadingEdit }] = useMutation(updateClient)

  return (
    <Layout>
      <Head>
        <title>Clientes</title>
      </Head>

      <div>
        <PageHeader title="Clientes">
          <Button variant="filled" onClick={openCreateClientModal} size="md">
            Crear
          </Button>
        </PageHeader>

        <Suspense fallback={<div>Loading...</div>}>
          <Flex align="center" gap="sm" mb="md">
            <SegmentedControl
              value={query.type || "all"}
              onChange={(value) =>
                setQuery(
                  {
                    type: value === "all" ? undefined : value,
                  },
                  "replace"
                )
              }
              data={[
                { label: "Todos", value: "all" },
                { label: "Propietarios", value: "owners" },
                { label: "Inquilinos", value: "tenants" },
              ]}
            />
          </Flex>
          <ClientsList
            type={query.type as (typeof listTypes)[number]}
            openEditClient={(client: Client) => setClientToEdit(client)}
          />
        </Suspense>

        <Modal opened={isCreateClientOpen} onClose={closeCreateClientModal} title="Crear cliente">
          <ClientForm
            isLoading={isLoading}
            submitText="Crear"
            schema={CreateClientSchema}
            onSubmit={async (values) => {
              const client = await createClientMutation(values)

              closeCreateClientModal()

              notifications.show({
                title: "Cliente creado exitosamente",
                message: "",
                color: "green",
                icon: <IconCheck />,
              })

              void router.push(Routes.ShowClientPage({ clientId: client.id }))
            }}
          />
        </Modal>

        <Modal
          opened={!!clientToEdit}
          onClose={() => setClientToEdit(undefined)}
          title={`Editar cliente ${clientToEdit?.id}`}
        >
          <ClientForm
            isLoading={isLoadingEdit}
            submitText="Editar"
            schema={CreateClientSchema}
            initialValues={clientToEdit}
            onSubmit={async (values) => {
              const updated = await updateClientMutation({
                id: clientToEdit!.id,
                ...values,
              })
              setClientToEdit(undefined)
              await router.push(Routes.ShowClientPage({ clientId: updated.id }))

              notifications.show({
                title: "Cliente editado exitosamente",
                message: "",
                color: "green",
                icon: <IconCheck />,
              })
            }}
          />
        </Modal>
      </div>
    </Layout>
  )
}

ClientsPage.authenticate = true

export default ClientsPage
