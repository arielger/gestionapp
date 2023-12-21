import { Client } from "@prisma/client"

export const getPersonFullName = (person: Client) => `${person.firstName} ${person.lastName}`

export const personToSelectItem = (person: Client) => ({
  value: String(person.id),
  label: getPersonFullName(person),
})
