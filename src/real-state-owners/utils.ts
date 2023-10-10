import { RealStateOwner, Tenant } from "@prisma/client"

type Person = RealStateOwner | Tenant

// TODO: move this to generic utils file
export const getPersonFullName = (person: Person) => `${person.firstName} ${person.lastName}`

export const personToSelectItem = (person: Person) => ({
  value: String(person.id),
  label: getPersonFullName(person),
})
