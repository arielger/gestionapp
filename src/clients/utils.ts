import { Client } from "@prisma/client"
import { addressFormInitialValue, mapAddressToFormInitialValues } from "src/addresses/utils"
import { ClientWithOptionalAddress } from "./types"

export const getPersonFullName = (person: Client) => `${person.firstName} ${person.lastName}`

export const personToSelectItem = (person: Client) => ({
  value: String(person.id),
  label: getPersonFullName(person),
})

export const clientFormInitialValues = {
  firstName: "",
  lastName: "",
  email: "",
  address: addressFormInitialValue,
  phoneNumber: "",
}

export const clientFormEditInitialValues = (client: ClientWithOptionalAddress) => ({
  firstName: client.firstName ?? undefined,
  lastName: client.lastName ?? undefined,
  email: client.email ?? undefined,
  address: client.address ? mapAddressToFormInitialValues(client.address) : addressFormInitialValue,
  phoneNumber: client.phoneNumber ?? undefined,
  identityDocNumber: client.identityDocNumber ?? undefined,
})
