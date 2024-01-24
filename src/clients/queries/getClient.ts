import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import { z } from "zod"

const GetClient = z
  .object({
    // This accepts type of undefined, but is required at runtime
    id: z.number().optional().refine(Boolean, "Required"),
  })
  .passthrough()

type GetClientInput = Pick<Prisma.ClientFindFirstArgs, "include">

export default resolver.pipe(
  resolver.zod(GetClient),
  resolver.authorize(),
  async ({ id, include }: z.infer<typeof GetClient> & GetClientInput, ctx) => {
    const tenant = await db.client.findFirst({
      where: { id, organizationId: ctx.session.orgId },
      include,
    })

    if (!tenant) throw new NotFoundError()

    return tenant
  }
)
