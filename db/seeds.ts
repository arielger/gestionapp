import { SecurePassword } from "@blitzjs/auth/secure-password"

import db from "./index"
import seedData from "./seed-data-example.json"

/*
 * This seed function is executed when you run `blitz db seed`.
 *
 * Probably you want to use a library like https://chancejs.com
 * to easily generate realistic data.
 */

const seed = async () => {
  try {
    seedData.organizations.forEach(async (organizationData) => {
      const orgUsersWithHashedPasswords = await Promise.all(
        organizationData.users.map(async (user) => ({
          name: user.name,
          email: user.email,
          hashedPassword: await SecurePassword.hash(user.password.trim()),
        }))
      )

      const organization = await db.organization.create({
        data: {
          name: organizationData.name,
          memberships: {
            create: orgUsersWithHashedPasswords.map((user) => ({
              user: {
                create: user,
              },
            })),
          },
        },
      })
      console.log(`✅ Company ${organization.name} created with users successfully`)
    })

    console.log("Users created successfully")
  } catch (error) {
    console.log("There was an error seeding the database", error)
  }
}

seed()
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await db.$disconnect()
    process.exit(1)
  })
