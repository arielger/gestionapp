import { Suspense } from "react"
import Layout from "src/core/layouts/Layout"
import { BlitzPage } from "@blitzjs/next"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { Hero } from "src/landing/components/Hero"

const Home: BlitzPage = () => {
  const currentUser = useCurrentUser()

  return (
    <Layout title="Gestionprop">
      <Suspense fallback="Loading...">
        {currentUser ? <span>Dashboard index</span> : <Hero />}
      </Suspense>
    </Layout>
  )
}

export default Home
