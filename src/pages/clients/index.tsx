import { Suspense, useEffect, useState } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useMutation } from "@blitzjs/rpc"
import { ActionIcon, Button, Group, SegmentedControl, Flex, Modal } from "@mantine/core"
import { IconEdit, IconTrash, IconEye } from "@tabler/icons-react"
import { z } from "src/core/zod"
import { StringParam, withDefault, useQueryParams } from "use-query-params"
import { IconCheck } from "@tabler/icons-react"
import { Client } from "@prisma/client"
import { useRouter } from "next/router"
import { useDisclosure } from "@mantine/hooks"

import { DataTable, actionsColumnConfig } from "src/core/components/DataTable"
import Layout from "src/core/layouts/Layout"
import getClients from "src/clients/queries/getClients"
import { usePaginatedTable } from "src/core/hooks/usePaginatedTable"
import { PageHeader } from "src/layout/components/PageHeader"
import { ClientForm } from "src/clients/components/ClientForm"
import { clientFormEditInitialValues, clientFormInitialValues } from "src/clients/utils"
import createClient from "src/clients/mutations/createClient"
import { CreateClientSchema } from "src/clients/schemas"
import updateClient from "src/clients/mutations/updateClient"
import { ClientWithOptionalAddress } from "src/clients/types"
import { useClientDelete } from "src/clients/hooks"
import { showSuccessNotification } from "src/core/notifications"

const listTypes = ["all", "owners", "tenants"] as const

export const ClientsList = ({
  type,
  openEditClient,
}: {
  type: (typeof listTypes)[number]
  openEditClient: (client: Client) => void
}) => {
  // TODO: add search by name
  const { tableProps, refetch: refetchClients } = usePaginatedTable({
    query: getClients,
    queryParams: { type },
  })

  const { isLoadingDelete, deleteMutationVariables, deleteClient } = useClientDelete({
    onSuccess: refetchClients,
  })

  const actionsDisabled = isLoadingDelete

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
                <ActionIcon disabled={actionsDisabled} size="sm" variant="subtle">
                  <IconEye size="1rem" stroke={1.5} />
                </ActionIcon>
              </Link>
              <ActionIcon
                disabled={actionsDisabled}
                onClick={() => openEditClient(client)}
                size="sm"
                variant="subtle"
              >
                <IconEdit size="1rem" stroke={1.5} />
              </ActionIcon>
              <ActionIcon
                disabled={actionsDisabled}
                loading={
                  isLoadingDelete && (deleteMutationVariables as { id: number })?.id === client.id
                }
                onClick={() => deleteClient(client.id)}
                size="sm"
                variant="subtle"
                color="red"
              >
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

  // validate that client type is one of the allowed values, if not replace query with default value
  useEffect(() => {
    const queryWithValidation = ClientsRouterQuerySchema.safeParse(query)
    if (!queryWithValidation.success) {
      setQuery({}, "replace")
    }
  }, [query, setQuery])

  const [isCreateClientOpen, { open: openCreateClientModal, close: closeCreateClientModal }] =
    useDisclosure(false)
  const [createClientMutation, { isLoading }] = useMutation(createClient)

  const [clientToEdit, setClientToEdit] = useState<ClientWithOptionalAddress | undefined>()
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
            openEditClient={(client: ClientWithOptionalAddress) => setClientToEdit(client)}
          />
        </Suspense>

        <Modal
          size="lg"
          opened={isCreateClientOpen}
          onClose={closeCreateClientModal}
          title="Crear cliente"
        >
          <ClientForm
            isLoading={isLoading}
            submitText="Crear"
            schema={CreateClientSchema}
            initialValues={clientFormInitialValues}
            onSubmit={async (values) => {
              const client = await createClientMutation(values)

              closeCreateClientModal()

              showSuccessNotification({
                title: "Cliente creado exitosamente",
                message: "",
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
          {clientToEdit && (
            <ClientForm
              isLoading={isLoadingEdit}
              submitText="Editar"
              schema={CreateClientSchema}
              initialValues={clientFormEditInitialValues(clientToEdit)}
              onSubmit={async (values) => {
                const updated = await updateClientMutation({
                  id: clientToEdit.id,
                  addressId: clientToEdit.addressId,
                  ...values,
                })
                setClientToEdit(undefined)
                await router.push(Routes.ShowClientPage({ clientId: updated.id }))

                showSuccessNotification({
                  title: "Cliente editado exitosamente",
                  message: "",
                  color: "green",
                  icon: <IconCheck />,
                })
              }}
            />
          )}
        </Modal>
      </div>
    </Layout>
  )
}

ClientsPage.authenticate = true

export default ClientsPage
