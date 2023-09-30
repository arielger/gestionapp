import { SecurePassword } from "@blitzjs/auth/secure-password"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { Role } from "types"
import { Signup } from "../schemas"

export default resolver.pipe(resolver.zod(Signup), async ({ email, password }, ctx) => {
  // TODO: Review - right now we are asigning the first real state agency as the user membership
  const firstRealStateAgency = await db.organization.findFirst()

  if (!firstRealStateAgency) {
    throw new Error("No real state agency found.")
  }

  const hashedPassword = await SecurePassword.hash(password.trim())
  const user = await db.user.create({
    data: {
      email: email.toLowerCase().trim(),
      hashedPassword,
      role: "USER",
      memberships: { create: { organization: { connect: { id: firstRealStateAgency?.id } } } },
    },
    select: { id: true, name: true, email: true, role: true },
  })

  await ctx.session.$create({
    userId: user.id,
    role: user.role as Role,
    orgId: firstRealStateAgency.id,
  })
  return user
})
