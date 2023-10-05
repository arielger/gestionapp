import Layout from "src/core/layouts/Layout"
import { BlitzPage, Routes } from "@blitzjs/next"
import { Loader, Center } from "@mantine/core"
import { useRedirectAuthenticated, useSession } from "@blitzjs/auth"

import { Hero } from "src/landing/components/Hero"
import { Suspense } from "react"

const Home: BlitzPage = () => {
  return (
    <Layout title="Gestionprop">
      <Hero />
    </Layout>
  )
}

Home.redirectAuthenticatedTo = Routes.PropertiesPage()

export default Home
