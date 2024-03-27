import { Organization } from "@prisma/client"

export const organizationFormEditInitialValues = (organization: Organization) => ({
  name: organization.name ?? undefined,
})
