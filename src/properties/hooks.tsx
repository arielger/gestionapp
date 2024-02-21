import { IconX, IconCheck } from "@tabler/icons-react"
import { useMutation } from "@blitzjs/rpc"
import { notifications } from "@mantine/notifications"

import deletePropertyMutation from "src/properties/mutations/deleteProperty"
import { RelatedExistingEntitiesError } from "src/core/errors"

export const usePropertyDelete = ({ onSuccess }: { onSuccess: () => void }) => {
  const [_deleteProperty, { isLoading: isLoadingDelete, variables: deleteMutationVariables }] =
    useMutation(deletePropertyMutation)

  const deleteProperty = async (propertyId: number) => {
    try {
      await _deleteProperty({ id: propertyId })

      notifications.show({
        title: "Propiedad eliminada exitosamente",
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
              title: "No se puede eliminar la propiedad porque tiene entidades relacionadas",
              message: "",
            }
          : {
              title: "Error al eliminar la propiedad",
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
    deleteProperty,
  }
}
