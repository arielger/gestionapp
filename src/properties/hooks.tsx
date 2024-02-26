import { useMutation } from "@blitzjs/rpc"

import deletePropertyMutation from "src/properties/mutations/deleteProperty"
import { RelatedExistingEntitiesError } from "src/core/errors"
import { showErrorNotification, showSuccessNotification } from "src/core/notifications"

export const usePropertyDelete = ({ onSuccess }: { onSuccess: () => void }) => {
  const [_deleteProperty, { isLoading: isLoadingDelete, variables: deleteMutationVariables }] =
    useMutation(deletePropertyMutation)

  const deleteProperty = async (propertyId: number) => {
    try {
      await _deleteProperty({ id: propertyId })

      showSuccessNotification({
        title: "Propiedad eliminada exitosamente",
        message: "",
      })
      onSuccess()
    } catch (error) {
      const relatedEntitiesError = error instanceof RelatedExistingEntitiesError
      showErrorNotification({
        ...(relatedEntitiesError
          ? {
              title: "No se puede eliminar la propiedad porque tiene entidades relacionadas",
              message: "",
            }
          : {
              title: "Error al eliminar la propiedad",
              message: "",
            }),
      })
    }
  }

  return {
    isLoadingDelete,
    deleteMutationVariables,
    deleteProperty,
  }
}
