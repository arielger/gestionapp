import { IconX, IconCheck } from "@tabler/icons-react"
import { useMutation } from "@blitzjs/rpc"
import { notifications } from "@mantine/notifications"

import deleteClientMutation from "src/clients/mutations/deleteClient"
import { RelatedExistingEntitiesError } from "src/core/errors"

export const useClientDelete = ({ onSuccess }: { onSuccess: () => void }) => {
  const [_deleteClient, { isLoading: isLoadingDelete, variables: deleteMutationVariables }] =
    useMutation(deleteClientMutation)

  const deleteClient = async (clientId: number) => {
    try {
      await _deleteClient({ id: clientId })

      notifications.show({
        title: "Cliente eliminado exitosamente",
        message: "",
        color: "green",
        icon: <IconCheck />,
      })
      onSuccess()
    } catch (error) {
      const relatedEntitiesError = error instanceof RelatedExistingEntitiesError
      notifications.show({
        ...(relatedEntitiesError
          ? {
              title: "No se puede eliminar el cliente porque tiene entidades relacionadas",
              message:
                "Asegurate de eliminar las propiedades y contratos asociados para poder realizar esta acción",
            }
          : {
              title: "Error al eliminar el cliente",
              message: "",
            }),
        color: "red",
        icon: <IconX />,
      })
    }
  }

  return {
    isLoadingDelete,
    deleteMutationVariables,
    deleteClient,
  }
}
