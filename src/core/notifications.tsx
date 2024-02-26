import { notifications, NotificationData } from "@mantine/notifications"
import { IconCheck, IconX } from "@tabler/icons-react"

export const showSuccessNotification = (props: NotificationData) => {
  notifications.show({
    color: "green",
    icon: <IconCheck />,
    ...props,
  })
}

export const showErrorNotification = (props: NotificationData) => {
  notifications.show({
    color: "red",
    icon: <IconX />,
    ...props,
  })
}
