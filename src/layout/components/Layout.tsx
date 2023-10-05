import { DashboardLayout } from "src/layout/components/DashboardLayout"
import { useSession } from "@blitzjs/auth"

export const Layout = ({ children }: { children: React.ReactElement }) => {
  const session = useSession()

  return session.userId ? <DashboardLayout>{children}</DashboardLayout> : <>{children}</>
}
