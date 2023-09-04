import { useRouter } from "next/router"
import { BlitzPage, Routes } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import { SignupForm } from "src/auth/components/SignupForm"

const SignupPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <Layout title="Crear cuenta">
      <SignupForm onSuccess={() => router.push(Routes.Home())} />
    </Layout>
  )
}

export default SignupPage
