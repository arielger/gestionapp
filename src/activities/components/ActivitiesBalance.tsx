import { useMutation, useQuery } from "@blitzjs/rpc"
import { Text, Modal, Button, Paper, Title, Flex, ActionIcon, Group } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { DataTable } from "mantine-datatable"
import { Activity, ActivityPersonType, ActivityType } from "@prisma/client"
import { IconCheck, IconEdit, IconTrash } from "@tabler/icons-react"

import { ActivityTransactionType } from "../config"
import createActivity from "../mutations/createActivity"
import getActivities from "../queries/getActivities"
import { ActivityWithDetails } from "../queries/types"
import { CreateActivityFormSchema, ActivityFormSchemaType } from "../schemas"
import { ActivityForm } from "./ActivityForm"
import deleteActivity from "../mutations/deleteActivity"
import updateActivity from "../mutations/updateActivity"
import { useState } from "react"

const activityTypeTranslations = {
  RENT: "Alquiler {month}",
  CUSTOM: "Manual",
}

const renderBalanceMovementCell = ({
  activity,
  assignedTo,
  type,
}: {
  activity: Activity
  assignedTo: ActivityPersonType
  type: "debit" | "credit" | "total"
}) => {
  const isDebitOrCredit = type === "debit" || type === "credit"

  if (
    assignedTo !== activity.assignedTo ||
    (isDebitOrCredit && activity.isDebit !== (type === "debit"))
  )
    return null

  if (type === "total") {
    return new Intl.NumberFormat().format(activity[activity.assignedTo].balance)
  }

  return (
    <Text c={activity.isDebit ? "red" : "teal"}>
      {activity.isDebit ? "-" : "+"}
      {new Intl.NumberFormat().format(activity.amount)}
    </Text>
  )
}

const getActivityTitle = (activity: ActivityWithDetails): string | undefined => {
  if (activity.type === ActivityType.CUSTOM) {
    return activity?.customDetails?.title
  }

  if (activity.type === ActivityType.RENT) {
    return activityTypeTranslations.RENT.replace(
      "{month}",
      activity.date.toLocaleString("es-AR", { month: "long" })
    )
  }

  return "Actividad"
}

export const ActivitiesBalance = ({ contractId }: { contractId: number }) => {
  // set date in state so it's not recalculated on every render
  // preveng infinite loop in db query
  const [currentDate] = useState(new Date())

  const [activitiesData, { isLoading: isLoadingActivities, refetch: refetchActivities }] = useQuery(
    getActivities,
    {
      where: {
        contractId,
        // activities from the past
        date: {
          lte: currentDate,
        },
      },
    },
    {
      suspense: false,
      enabled: !!contractId,
    }
  )

  const activities = activitiesData?.items ?? []

  const activitiesWithMovements = activities?.reduce(
    (acc, activity) => {
      const isOwnerMovement = activity.assignedTo === ActivityPersonType.OWNER
      const newOwnerBalance = isOwnerMovement
        ? acc.ownerBalance + (activity.isDebit ? -activity.amount : activity.amount)
        : acc.ownerBalance
      const newTenantBalance = !isOwnerMovement
        ? acc.tenantBalance + (activity.isDebit ? -activity.amount : activity.amount)
        : acc.tenantBalance

      const activityWithBalance = {
        ...activity,
        [activity.assignedTo]: {
          balance: isOwnerMovement ? newOwnerBalance : newTenantBalance,
          [activity.isDebit ? "debit" : "credit"]: activity.amount,
        },
      }

      return {
        rows: [...acc.rows, activityWithBalance],
        ownerBalance: newOwnerBalance,
        tenantBalance: newTenantBalance,
      }
    },
    { rows: [], ownerBalance: 0, tenantBalance: 0 }
  )

  const [opened, { open, close }] = useDisclosure(false)
  const [selectedActivity, setSelectedActivity] = useState<
    (ActivityFormSchemaType & { id: number }) | null
  >(null)

  const [createActivityMutation, { isLoading: isLoadingCreateActivity }] =
    useMutation(createActivity)

  const [updateActivityMutation, { isLoading: isLoadingUpdateActivity }] =
    useMutation(updateActivity)
  const handleOpenEditActivity = (activity: ActivityWithDetails) => {
    const { isDebit, type, customDetails, ...activityData } = activity

    // todo: create a mapper fn to transform from form to backend and backend to form
    setSelectedActivity({
      ...activityData,
      transactionType: isDebit ? ActivityTransactionType.DEBIT : ActivityTransactionType.CREDIT,
      ...(type === ActivityType.CUSTOM
        ? {
            type: ActivityType.CUSTOM,
            details: {
              title: customDetails?.title ?? "",
            },
          }
        : {
            type,
          }),
    })
    open()
  }

  const [deleteActivityMutation] = useMutation(deleteActivity)
  const handleDeleteActivity = async (activity: Activity) => {
    await deleteActivityMutation({ id: activity.id })

    void refetchActivities()

    notifications.show({
      title: "Actividad eliminada exitosamente",
      message: "",
      color: "green",
      icon: <IconCheck />,
    })
  }

  return (
    <Paper shadow="xs" p="xl" mt="md">
      <Flex justify="space-between" align="center" mb="md">
        <Title order={2}>Balance</Title>
        <Button onClick={open}>Crear nueva</Button>
      </Flex>
      <Modal
        opened={opened}
        onClose={close}
        title={selectedActivity ? "Editar actividad" : "Crear actividad"}
      >
        <ActivityForm
          submitText={selectedActivity ? "Guardar" : "Crear"}
          initialValues={
            selectedActivity ?? {
              transactionType: ActivityTransactionType.DEBIT,
              type: ActivityType.CUSTOM,
              assignedTo: ActivityPersonType.TENANT,
              details: {
                title: "",
              },
            }
          }
          schema={CreateActivityFormSchema}
          onSubmit={async (input) => {
            const { transactionType, ...activityData } = input

            const isDebit = transactionType === ActivityTransactionType.DEBIT

            try {
              const input = { ...activityData, isDebit, contractId }
              if (selectedActivity) {
                await updateActivityMutation({
                  input: {
                    ...input,
                    id: selectedActivity.id,
                  },
                })

                notifications.show({
                  title: "Actividad modificada exitosamente",
                  message: "Ya podes ver los cambios en el balance",
                  color: "green",
                  icon: <IconCheck />,
                })
              } else {
                await createActivityMutation({
                  input,
                })

                notifications.show({
                  title: "Actividad creada exitosamente",
                  message: "Ya podes ver la nueva actividad en el balance",
                  color: "green",
                  icon: <IconCheck />,
                })
              }

              void refetchActivities()

              close()
            } catch (error: any) {
              console.error(error)
              // return {
              //   [FORM_ERROR]: error.toString(),
              // }
            }
          }}
          isLoading={isLoadingCreateActivity || isLoadingUpdateActivity}
        />
      </Modal>
      <DataTable
        fetching={isLoadingActivities}
        minHeight={200}
        groups={[
          {
            id: "general",
            title: "General",
            columns: [
              {
                accessor: "date",
                title: "Fecha",
                render: ({ date }) => date.toLocaleString(),
              },
              { accessor: "type", title: "Tipo", render: getActivityTitle },
            ],
          },
          {
            id: "tenant",
            title: "Inquilino",
            columns: [
              {
                accessor: `${ActivityPersonType.TENANT}.debit`,
                title: "Debe",
                render: (activity) =>
                  renderBalanceMovementCell({
                    activity,
                    assignedTo: ActivityPersonType.TENANT,
                    type: "debit",
                  }),
              },
              {
                accessor: `${ActivityPersonType.TENANT}.credit`,
                title: "Haber",
                render: (activity) =>
                  renderBalanceMovementCell({
                    activity,
                    assignedTo: ActivityPersonType.TENANT,
                    type: "credit",
                  }),
              },
              {
                accessor: `${ActivityPersonType.TENANT}.balance`,
                title: "Saldo",
                render: (activity) =>
                  renderBalanceMovementCell({
                    activity,
                    assignedTo: ActivityPersonType.TENANT,
                    type: "total",
                  }),
              },
            ],
          },
          {
            id: "owner",
            title: "Propietario",
            columns: [
              {
                accessor: `${ActivityPersonType.OWNER}.debit`,
                title: "Debe",
                render: (activity) =>
                  renderBalanceMovementCell({
                    activity,
                    assignedTo: ActivityPersonType.OWNER,
                    type: "debit",
                  }),
              },
              {
                accessor: `${ActivityPersonType.OWNER}.credit`,
                title: "Haber",
                render: (activity) =>
                  renderBalanceMovementCell({
                    activity,
                    assignedTo: ActivityPersonType.OWNER,
                    type: "credit",
                  }),
              },
              {
                accessor: `${ActivityPersonType.OWNER}.balance`,
                title: "Saldo",
                render: (activity) =>
                  renderBalanceMovementCell({
                    activity,
                    assignedTo: ActivityPersonType.OWNER,
                    type: "total",
                  }),
              },
              {
                accessor: "actions",
                title: "Acciones",
                render: (activity) => (
                  <Group spacing={0} position="right" noWrap>
                    <ActionIcon onClick={() => handleOpenEditActivity(activity)}>
                      <IconEdit size="1rem" stroke={1.5} />
                    </ActionIcon>
                    <ActionIcon color="red" onClick={() => handleDeleteActivity(activity)}>
                      <IconTrash size="1rem" stroke={1.5} />
                    </ActionIcon>
                  </Group>
                ),
              },
            ],
          },
        ]}
        records={activitiesWithMovements?.rows}
      />
    </Paper>
  )
}
