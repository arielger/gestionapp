import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useParam } from "@blitzjs/next"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import { PageHeader } from "src/layout/components/PageHeader"
import Layout from "src/core/layouts/Layout"
import { CreateContractSchema } from "src/contracts/schemas"
import createContract from "src/contracts/mutations/createContract"
import { ContractForm } from "src/contracts/components/ContractForm"

const NewContractPage = () => {
  const router = useRouter()
  const propertyId = useParam("propertyId", "number")
  const [createContractMutation, { isLoading }] = useMutation(createContract)

  return (
    <Layout title={"Create New Contract"}>
      <PageHeader title={`Crear nuevo contrato`} />
      <Suspense fallback={<div>Loading...</div>}>
        <ContractForm
          isLoading={isLoading}
          submitText="Crear contrato"
          schema={CreateContractSchema.omit({ propertyId: true })}
          // initialValues={{}}
          onSubmit={async (values) => {
            try {
              const contract = await createContractMutation({ ...values, propertyId: propertyId! })
              await router.push(
                Routes.ShowContractPage({
                  propertyId: propertyId!,
                  contractId: contract.id,
                })
              )
            } catch (error: any) {
              console.error(error)
            }
          }}
        />
      </Suspense>
      <p>
        <Link href={Routes.ContractsPage({ propertyId: propertyId! })}>Contracts</Link>
      </p>
    </Layout>
  )
}

NewContractPage.authenticate = true

export default NewContractPage
