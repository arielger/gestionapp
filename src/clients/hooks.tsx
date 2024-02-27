import { useMutation } from "@blitzjs/rpc"

import deleteClientMutation from "src/clients/mutations/deleteClient"
import { RelatedExistingEntitiesError } from "src/core/errors"
import { showErrorNotification, showSuccessNotification } from "src/core/notifications"

export const useClientDelete = ({ onSuccess }: { onSuccess: () => void }) => {
  const [_deleteClient, { isLoading: isLoadingDelete, variables: deleteMutationVariables }] =
    useMutation(deleteClientMutation)

  const deleteClient = async (clientId: number) => {
    try {
      await _deleteClient({ id: clientId })

      showSuccessNotification({
        title: "Cliente eliminado exitosamente",
        message: "",
      })
      onSuccess()
    } catch (error) {
      const relatedEntitiesError = error instanceof RelatedExistingEntitiesError
      showErrorNotification({
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
      })
    }
  }

  return {
    isLoadingDelete,
    deleteMutationVariables,
    deleteClient,
  }
}
