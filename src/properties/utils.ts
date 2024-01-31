import { Address } from "@prisma/client"

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
