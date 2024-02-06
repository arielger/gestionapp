import { Address } from "@prisma/client"

export const addressFormInitialValue = {
  street: "",
  // Pass undefined as initial value to prevent showing 0 when initializing the form
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  streetNumber: undefined as any,
  subpremise: "",
  state: "",
  city: "",
  postalCode: "",
}

export const getAddressString = ({
  address,
  withCityDetails,
}: {
  address: Address
  withCityDetails?: boolean
}) => {
  if (withCityDetails) {
    return `${address.street} ${address.streetNumber} ${address.subpremise}, ${address.city}, ${address.state}`
  }

  return `${address.street} ${address.streetNumber} ${address.subpremise}`
}

// map address fields to prevent type errors when passing null (for optional fields)
export const mapAddressToFormInitialValues = (address: Address) => ({
  street: address?.street,
  streetNumber: address?.streetNumber,
  subpremise: address?.subpremise ?? undefined,
  state: address?.state,
  city: address?.city,
  postalCode: address?.postalCode ?? undefined,
})
