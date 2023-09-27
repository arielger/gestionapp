import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import getContract from "src/contracts/queries/getContract"
import deleteContract from "src/contracts/mutations/deleteContract"

export const Contract = () => {
  const router = useRouter()
  const contractId = useParam("contractId", "number")
  const propertyId = useParam("propertyId", "number")
  const [deleteContractMutation] = useMutation(deleteContract)
  const [contract] = useQuery(getContract, { id: contractId })

  return (
    <>
      <Head>
        <title>Contract {contract.id}</title>
      </Head>

      <div>
        <h1>Contract {contract.id}</h1>
        <pre>{JSON.stringify(contract, null, 2)}</pre>

        <Link
          href={Routes.EditContractPage({
            propertyId: propertyId!,
            contractId: contract.id,
          })}
        >
          Edit
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteContractMutation({ id: contract.id })
              await router.push(Routes.ContractsPage({ propertyId: propertyId! }))
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowContractPage = () => {
  const propertyId = useParam("propertyId", "number")

  return (
    <div>
      <p>
        <Link href={Routes.ContractsPage({ propertyId: propertyId! })}>Contracts</Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Contract />
      </Suspense>
    </div>
  )
}

ShowContractPage.authenticate = true
ShowContractPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowContractPage
