import { ErrorFallbackProps, ErrorComponent, ErrorBoundary, AppProps } from "@blitzjs/next"
import { AuthenticationError, AuthorizationError } from "blitz"
import React from "react"
import { MantineProvider } from "@mantine/core"
import { withBlitz } from "src/blitz-client"
import "src/styles/globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

function RootErrorFallback({ error }: ErrorFallbackProps) {
  if (error instanceof AuthenticationError) {
    return <div>Error: You are not authenticated</div>
  } else if (error instanceof AuthorizationError) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title="Sorry, you are not authorized to access this"
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
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        /** Put your mantine theme override here */
        colorScheme: "light",
      }}
    >
      <ErrorBoundary FallbackComponent={RootErrorFallback}>
        <main className={inter.className}>{getLayout(<Component {...pageProps} />)}</main>
      </ErrorBoundary>
    </MantineProvider>
  )
}

export default withBlitz(MyApp)
