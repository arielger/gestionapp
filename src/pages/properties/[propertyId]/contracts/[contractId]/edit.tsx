import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import { UpdateContractSchema } from "src/contracts/schemas"
import getContract from "src/contracts/queries/getContract"
import updateContract from "src/contracts/mutations/updateContract"
import { ContractForm } from "src/contracts/components/ContractForm"
import { PageHeader } from "src/layout/components/PageHeader"

export const EditContract = () => {
  const router = useRouter()
  const contractId = useParam("contractId", "number")
  const propertyId = useParam("propertyId", "number")
  const [{ contract, initialValues }, { setQueryData }] = useQuery(
    getContract,
    { id: contractId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
      select: (contract) => ({
        contract,
        initialValues: {
          ...contract,
          owners: contract.owners.map((owner) => owner.id),
          tenants: contract.tenants.map((tenant) => tenant.id),
        },
      }),
    }
  )
  const [updateContractMutation] = useMutation(updateContract)

  return (
    <>
      <Head>
        <title>Editar contrato #{contract.id}</title>
      </Head>

      <div>
        <PageHeader title={`Editar Contract ${contract.id}`} />
        <Suspense fallback={<div>Loading...</div>}>
          <ContractForm
            submitText="Update Contract"
            schema={UpdateContractSchema.omit({ id: true })}
            initialValues={initialValues}
            onSubmit={async (values) => {
              try {
                const updated = await updateContractMutation({
                  id: contract.id,
                  ...values,
                })
                // await setQueryData(updated)
                await router.push(
                  Routes.ShowContractPage({
                    propertyId: propertyId!,
                    contractId: updated.id,
                  })
                )
              } catch (error: any) {
                console.error(error)
                // return {
                //   [FORM_ERROR]: error.toString(),
                // }
              }
            }}
          />
        </Suspense>
      </div>
    </>
  )
}

const EditContractPage = () => {
  const propertyId = useParam("propertyId", "number")

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditContract />
      </Suspense>

      <p>
        <Link href={Routes.ContractsPage({ propertyId: propertyId! })}>Contracts</Link>
      </p>
    </div>
  )
}

EditContractPage.authenticate = true
EditContractPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditContractPage
