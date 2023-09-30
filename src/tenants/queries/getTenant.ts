import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetTenant = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetTenant), resolver.authorize(), async ({ id }, ctx) => {
  const tenant = await db.tenant.findFirst({ where: { id, organizationId: ctx.session.orgId } })

  if (!tenant) throw new NotFoundError()

  return tenant
})
