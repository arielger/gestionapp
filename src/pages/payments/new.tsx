import { Suspense } from "react"

import Layout from "src/core/layouts/Layout"
import { PageHeader } from "src/layout/components/PageHeader"
import { PaymentForm } from "src/payments/components/PaymentForm"

const NewPaymentPage = () => {
  return (
    <Layout title={"Nuevo pago"}>
      <PageHeader title="Crear nuevo pago" />
      <Suspense fallback={<div>Loading...</div>}>
        <PaymentForm />
      </Suspense>
    </Layout>
  )
}

NewPaymentPage.authenticate = true

export default NewPaymentPage
