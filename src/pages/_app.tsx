import { ErrorFallbackProps, ErrorComponent, ErrorBoundary, AppProps } from "@blitzjs/next"
import { AuthenticationError, AuthorizationError } from "blitz"
import React, { Suspense } from "react"
import { MantineProvider } from "@mantine/core"
import { DatesProvider } from "@mantine/dates"
import { withBlitz } from "src/blitz-client"
import { Inter } from "next/font/google"
import "dayjs/locale/es"

import "src/styles/globals.css"
import { Layout } from "src/layout/components/Layout"
import { useQueryErrorResetBoundary } from "@blitzjs/rpc"
import { LoginForm } from "src/auth/components/LoginForm"

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

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        /** Put your mantine theme override here */
        colorScheme: "light",
        ...inter.style,
      }}
    >
      <DatesProvider settings={{ locale: "es", firstDayOfWeek: 1 }}>
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
