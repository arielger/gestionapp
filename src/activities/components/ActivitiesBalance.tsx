import { useQuery } from "@blitzjs/rpc"
import { Text, Modal, Button, Paper, Title, Flex, Badge } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { DataTable } from "mantine-datatable"
import { Activity, ActivityPersonType, Contract } from "@prisma/client"
import { useRouter } from "next/router"

import getActivities from "../queries/getActivities"
import { getActivityTitle } from "../utils"
import { SelectActivitiesTable } from "src/payments/components/PaymentForm/SelectActivitiesTable"
import { Routes } from "@blitzjs/next"
import { ActivityFormModal, ActivityFormModalState } from "./ActivityFormModal"
import { useState } from "react"

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
    <Text size="sm" c={activity.isDebit ? "red" : "teal"}>
      {activity.isDebit ? "-" : "+"}
      {new Intl.NumberFormat().format(activity.amount)}
    </Text>
  )
}

export const ActivitiesBalance = ({ contract }: { contract: Contract }) => {
  const router = useRouter()

  const [activitiesData, { isLoading: isLoadingActivities, refetch: refetchActivities }] = useQuery(
    getActivities,
    {
      where: {
        contractId: contract.id,
      },
      filterFutureActivities: true,
    },
    {
      suspense: false,
      enabled: !!contract.id,
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

  // const [deleteActivityMutation] = useMutation(deleteActivity)
  // const handleDeleteActivity = async (activity: Activity) => {
  //   await deleteActivityMutation({ id: activity.id })

  //   void refetchActivities()

  //   showSuccessNotification({
  //     title: "Actividad eliminada exitosamente",
  //     message: "",
  //   })
  // }

  const [addPaymentOpened, { open: openAddPayment, close: closeAddPayment }] = useDisclosure(false)

  const [activityFormModalState, setActivityFormModalState] = useState<
    ActivityFormModalState | undefined
  >()

  return (
    <>
      <Paper shadow="xs" p="xl" mt="md">
        <Flex justify="space-between" align="center" mb="md">
          <Title order={2}>Balance</Title>
          <Flex gap="sm">
            <Button onClick={openAddPayment}>Registrar pago</Button>
            <Button onClick={() => setActivityFormModalState({ type: "NEW" })}>
              Crear actividad
            </Button>
          </Flex>
        </Flex>

        <Modal size="lg" opened={addPaymentOpened} onClose={closeAddPayment} title="Registrar pago">
          <SelectActivitiesTable
            contract={contract}
            onCreatePayment={(paymentId) => {
              closeAddPayment()
              void refetchActivities()
              void router.push(Routes.ShowPaymentPage({ paymentId }))
            }}
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
                  render: ({ date }) => date.toLocaleDateString(),
                },
                { accessor: "type", title: "Tipo", render: getActivityTitle },
                {
                  accessor: "status",
                  title: "Estado",
                  render: (activity) => {
                    if (activity.assignedTo === ActivityPersonType.TENANT && activity.isDebit) {
                      if (activity.rentPaymentDebtPaidByActivity) {
                        return (
                          <Badge variant="light" color="green" radius="xs">
                            Pago
                          </Badge>
                        )
                      } else {
                        return (
                          <Badge variant="light" color="red" radius="xs">
                            Adeuda
                          </Badge>
                        )
                      }
                    }
                  },
                },
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
                // TODO: Review if we need to add edit/delete actions again
                // {
                //   ...actionsColumnConfig,
                //   render: (activity) => (
                //     <Group gap={4} justify="right" wrap="nowrap">
                //       <ActionIcon
                //         size="sm"
                //         variant="subtle"
                //         onClick={() =>
                //           setActivityFormModalState({
                //             type: "EDIT",
                //             activity: transformActivityEntityToForm(activity),
                //           })
                //         }
                //       >
                //         <IconEdit size="1rem" />
                //       </ActionIcon>
                //       <ActionIcon
                //         size="sm"
                //         variant="subtle"
                //         color="red"
                //         onClick={() => handleDeleteActivity(activity)}
                //       >
                //         <IconTrash size="1rem" />
                //       </ActionIcon>
                //     </Group>
                //   ),
                // },
              ],
            },
          ]}
          records={activitiesWithMovements?.rows}
        />
      </Paper>
      <ActivityFormModal
        state={activityFormModalState}
        contractId={contract.id}
        onClose={() => setActivityFormModalState(undefined)}
        onSuccess={() => {
          void refetchActivities()
        }}
      />
    </>
  )
}
