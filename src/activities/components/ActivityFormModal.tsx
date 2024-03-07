import { Modal } from "@mantine/core"
import { useMutation } from "@blitzjs/rpc"
import { ActivityPersonType, ActivityType } from "@prisma/client"

import { ActivityForm, transformActivityFormToEntity } from "./ActivityForm"
import { CreateActivityFormSchema, ActivityFormSchemaType } from "../schemas"
import { ActivityTransactionType } from "../config"
import createActivity from "../mutations/createActivity"
import updateActivity from "../mutations/updateActivity"
import { showSuccessNotification } from "src/core/notifications"

export type ActivityFormModalState = {
  type: "NEW" | "EDIT"
  activity?: (ActivityFormSchemaType & { id: number }) | null
}

const initialFormValues = {
  transactionType: ActivityTransactionType.DEBIT,
  type: ActivityType.CUSTOM,
  assignedTo: ActivityPersonType.TENANT,
  details: {
    title: "",
  },
}

export const ActivityFormModal = ({
  state,
  contractId,
  onClose,
  onSuccess,
}: {
  state?: ActivityFormModalState
  contractId: number
  onClose: () => void
  onSuccess: () => void
}) => {
  const [createActivityMutation, { isLoading: isLoadingCreateActivity }] =
    useMutation(createActivity)

  const [updateActivityMutation, { isLoading: isLoadingUpdateActivity }] =
    useMutation(updateActivity)

  const isEdit = state?.type === "EDIT"

  return (
    <Modal
      opened={!!state}
      onClose={onClose}
      title={isEdit ? "Editar actividad" : "Crear actividad"}
    >
      <ActivityForm
        submitText={isEdit ? "Guardar" : "Crear"}
        initialValues={state?.activity ?? initialFormValues}
        // TODO: add update schema when editing
        schema={CreateActivityFormSchema}
        onSubmit={async (values) => {
          const input = {
            ...transformActivityFormToEntity(values),
            contractId,
          }

          if (state?.activity) {
            await updateActivityMutation({
              input: {
                ...input,
                id: state.activity.id,
              },
            })

            showSuccessNotification({
              title: "Actividad modificada exitosamente",
              message: "Ya podes ver los cambios en el balance",
            })
          } else {
            await createActivityMutation({
              input,
            })

            showSuccessNotification({
              title: "Actividad creada exitosamente",
              message: "Ya podes ver la nueva actividad en el balance",
            })
          }

          onSuccess?.()
          onClose()
        }}
        isLoading={isLoadingCreateActivity || isLoadingUpdateActivity}
      />
    </Modal>
  )
}
