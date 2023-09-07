import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { DashboardLayout } from "src/layout/components/DashboardLayout"

export const Layout = ({ children }: { children: React.ReactElement }) => {
  const currentUser = useCurrentUser()

  return currentUser ? <DashboardLayout>{children}</DashboardLayout> : <>{children}</>
}
