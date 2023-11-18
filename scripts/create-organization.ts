import db from "db"

import signup from "src/auth/mutations/signup"

const orgName = "Organization name"
const usersData = [
  {
    name: "Example name",
    email: "example@example.com",
    password: "example-password",
  },
]

const scriptFn = async () => {
  const newOrganization = await db.organization.create({
    data: {
      name: orgName,
    },
  })
  console.log("✅ New organization created: ", newOrganization)

  const users = await Promise.all(
    usersData.map((user) =>
      signup(
        {
          ...user,
          organizationId: newOrganization.id,
          createSession: false,
        },
        {} as any // no context in custom script - hacky solution
      )
    )
  )

  console.log("✅ Users: ", users)
}

scriptFn()
  .then(() => {
    console.log("Success ✅")
  })
  .catch((error) => {
    console.log("Error ❌", error)
  })
