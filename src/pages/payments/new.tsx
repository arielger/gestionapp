import { useMutation } from "@blitzjs/rpc"
import { Suspense } from "react"
import { Paper } from "@mantine/core"

import Layout from "src/core/layouts/Layout"
import { PageHeader } from "src/layout/components/PageHeader"
import createPayment from "src/payments/mutations/createPayment"
import { PaymentForm } from "src/payments/components/PaymentForm"
import { CreatePaymentSchema } from "src/payments/schemas"

const NewPaymentPage = () => {
  const [createPaymentMutation, { isLoading }] = useMutation(createPayment)

  return (
    <Layout title={"Nuevo pago"}>
      <PageHeader title="Crear nuevo pago" />
      <Suspense fallback={<div>Loading...</div>}>
        <Paper shadow="xs" p="xl">
          <PaymentForm
            submitText="Crear"
            schema={CreatePaymentSchema}
            onSubmit={async (values) => {
              try {
                const payment = await createPaymentMutation(values)
                console.log("payment", payment)
              } catch (error: any) {
                console.error(error)
                // return {
                //   [FORM_ERROR]: error.toString(),
                // }
              }
            }}
            isLoading={isLoading}
          />
        </Paper>
      </Suspense>
    </Layout>
  )
}

NewPaymentPage.authenticate = true

export default NewPaymentPage
