import Layout from "src/core/layouts/Layout"
import { BlitzPage, Routes } from "@blitzjs/next"

import { Hero } from "src/landing/components/Hero/Hero"

const Home: BlitzPage = () => {
  return (
    <Layout title="gestion.app">
      <Hero />
    </Layout>
  )
}

Home.redirectAuthenticatedTo = Routes.PropertiesPage()

export default Home
