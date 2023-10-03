import { Suspense } from "react"
import Layout from "src/core/layouts/Layout"
import { BlitzPage, Routes } from "@blitzjs/next"
import { useRouter } from "next/router"

import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { Hero } from "src/landing/components/Hero"

const Home: BlitzPage = () => {
  const currentUser = useCurrentUser()
  const router = useRouter()

  const redirectToDefaultPage = async () => {
    await router.replace(Routes.PropertiesPage().pathname)
  }

  if (currentUser) {
    void redirectToDefaultPage()
  }

  return (
    <Layout title="Gestionprop">
      <Suspense fallback="Loading...">
        {currentUser ? <span>Dashboard index</span> : <Hero />}
      </Suspense>
    </Layout>
  )
}

export default Home
