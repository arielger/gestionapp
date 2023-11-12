import { SecurePassword } from "@blitzjs/auth/secure-password"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { Role } from "types"
import { Signup } from "../schemas"
import { z } from "zod"

export default resolver.pipe(
  resolver.zod(
    Signup.extend({
      createSession: z.boolean().default(true),
    })
  ),
  async ({ email, password, organizationId, createSession }, ctx) => {
    const organization = await db.organization.findFirst({
      where: {
        id: organizationId,
      },
    })

    if (!organization) {
      throw new Error(`No organization with the id ${organizationId} found.`)
    }

    const hashedPassword = await SecurePassword.hash(password.trim())
    const user = await db.user.create({
      data: {
        email: email.toLowerCase().trim(),
        hashedPassword,
        role: "USER",
        memberships: { create: { organization: { connect: { id: organization?.id } } } },
      },
      select: { id: true, name: true, email: true, role: true },
    })

    if (createSession) {
      await ctx.session.$create({
        userId: user.id,
        role: user.role as Role,
        orgId: organization.id,
      })
    }

    return user
  }
)
