import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import { z } from "src/core/zod"

const GetOrganization = z
  .object({
    // This accepts type of undefined, but is required at runtime
    name: z.string().optional(),
    id: z.number().optional(),
  })
  .passthrough()

type GetOrganizationInput = Pick<Prisma.OrganizationFindFirstArgs, "where">

export default resolver.pipe(
  resolver.zod(GetOrganization),
  resolver.authorize(),
  async ({ id }: z.infer<typeof GetOrganization> & GetOrganizationInput, ctx) => {
    const organization = await db.organization.findFirst({
      where: { id },
    })

    if (!organization) throw new NotFoundError()

    return organization
  }
)
