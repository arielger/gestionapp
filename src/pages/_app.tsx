import { ErrorFallbackProps, ErrorComponent, ErrorBoundary, AppProps } from "@blitzjs/next"
import { AuthenticationError, AuthorizationError } from "blitz"
import React, { Suspense } from "react"
import { MantineProvider, createTheme } from "@mantine/core"
import { DatesProvider } from "@mantine/dates"
import { Notifications } from "@mantine/notifications"
import { withBlitz } from "src/blitz-client"
import { Inter } from "next/font/google"

import { Layout } from "src/layout/components/Layout"
import { useQueryErrorResetBoundary } from "@blitzjs/rpc"
import { LoginForm } from "src/auth/components/LoginForm"

import "dayjs/locale/es"

// styles
import "@mantine/core/styles.layer.css"
import "@mantine/dates/styles.layer.css"
import "@mantine/notifications/styles.layer.css"
import "mantine-datatable/styles.layer.css"

const inter = Inter({ subsets: ["latin"] })

function RootErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  if (error instanceof AuthenticationError) {
    return <LoginForm onSuccess={resetErrorBoundary} />
  } else if (error instanceof AuthorizationError) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title="Lo sentimos, no estas autorizado a ingresar a esta página"
      />
    )
  } else {
    return (
      <ErrorComponent
        statusCode={(error as any)?.statusCode || 400}
        title={error.message || error.name}
      />
    )
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)

  // This ensures the Blitz useQuery hooks will automatically refetch
  // data any time you reset the error boundary
  const { reset } = useQueryErrorResetBoundary()

  const theme = createTheme({
    /** Put your mantine theme override here */
    ...inter.style,
  })

  return (
    <MantineProvider theme={theme}>
      <DatesProvider settings={{ locale: "es", firstDayOfWeek: 1 }}>
        <Notifications autoClose={5000} />
        <ErrorBoundary FallbackComponent={RootErrorFallback} onReset={reset}>
          <Suspense fallback="Loading...">
            <Layout>{getLayout(<Component {...pageProps} />)}</Layout>
          </Suspense>
        </ErrorBoundary>
      </DatesProvider>
    </MantineProvider>
  )
}

export default withBlitz(MyApp)
