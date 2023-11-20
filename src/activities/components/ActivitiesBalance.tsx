import { useMutation, useQuery } from "@blitzjs/rpc"
import { Text, Modal, Button, Paper, Title, Flex, ActionIcon } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { DataTable } from "mantine-datatable"
import { Activity, ActivityPersonType, ActivityType } from "@prisma/client"
import { IconCheck, IconTrash } from "@tabler/icons-react"

import { ActivityTransactionType } from "../config"
import createActivity from "../mutations/createActivity"
import getActivities from "../queries/getActivities"
import { ActivityWithDetails } from "../queries/types"
import { CreateActivityFormSchema } from "../schemas"
import { ActivityForm } from "./ActivityForm"
import deleteActivity from "../mutations/deleteActivity"

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
    <Text c={activity.isDebit ? "red" : "green"}>
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
      activity.createdAt.toLocaleString("default", { month: "long" })
    )
  }

  return "Actividad"
}

export const ActivitiesBalance = ({ contractId }: { contractId: number }) => {
  const [activitiesData, { isLoading: isLoadingActivities, refetch: refetchActivities }] = useQuery(
    getActivities,
    { contractId },
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
  const [createActivityMutation, { isLoading: isLoadingCreateActivity }] =
    useMutation(createActivity)

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
      <Modal opened={opened} onClose={close} title="Crear actividad">
        <ActivityForm
          submitText="Crear"
          initialValues={{
            transactionType: ActivityTransactionType.DEBIT,
            type: ActivityType.CUSTOM,
            assignedTo: ActivityPersonType.TENANT,
            details: {
              title: "",
            },
          }}
          schema={CreateActivityFormSchema}
          onSubmit={async (input) => {
            const { transactionType, ...activityData } = input

            const isDebit = transactionType === ActivityTransactionType.DEBIT

            try {
              await createActivityMutation({
                input: { ...activityData, isDebit, contractId },
              })

              notifications.show({
                title: "Actividad creada exitosamente",
                message: "Ya podes ver la nueva actividad en el balance",
                color: "green",
                icon: <IconCheck />,
              })

              void refetchActivities()

              close()
            } catch (error: any) {
              console.error(error)
              // return {
              //   [FORM_ERROR]: error.toString(),
              // }
            }
          }}
          isLoading={isLoadingCreateActivity}
        />
      </Modal>
      <DataTable
        groups={[
          {
            id: "general",
            title: "General",
            columns: [
              {
                accessor: "createdAt",
                title: "Fecha",
                render: ({ createdAt }) => createdAt.toLocaleString(),
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
                  <ActionIcon color="red" onClick={() => handleDeleteActivity(activity)}>
                    <IconTrash size="1rem" stroke={1.5} />
                  </ActionIcon>
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
