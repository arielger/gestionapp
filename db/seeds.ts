import db from "./index"

/*
 * This seed function is executed when you run `blitz db seed`.
 *
 * Probably you want to use a library like https://chancejs.com
 * to easily generate realistic data.
 */

const seed = async () => {
  const orgs = ["Grupo Gestionar", "3G Propiedades"]

  const organizations = await db.$transaction(
    orgs.map((org) => db.organization.create({ data: { name: org } }))
  )

  if (!organizations[0] || !organizations[1]) {
    throw Error("No organizations created")
  }

  await db.user.create({
    data: {
      email: "gustavo@gestionar.com",
      name: "Gustavo Gestionar",
      // password = test123456
      hashedPassword:
        "JGFyZ29uMmlkJHY9MTkkbT02NTUzNix0PTIscD0xJHRBTVZYYzBMWmlTRUh4WjY5bTAxQVEkcnJJVE45elJOcUxjbmVNc3hLUkU2eTZsVmYzbVlHT2dqbFNaMHJOVE1GVQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
      memberships: {
        create: {
          organizationId: organizations[0].id,
        },
      },
    },
  })

  await db.user.create({
    data: {
      email: "ariel@gestionar.com",
      name: "Ariel Gestionar",
      // password = test123456
      hashedPassword:
        "JGFyZ29uMmlkJHY9MTkkbT02NTUzNix0PTIscD0xJHRBTVZYYzBMWmlTRUh4WjY5bTAxQVEkcnJJVE45elJOcUxjbmVNc3hLUkU2eTZsVmYzbVlHT2dqbFNaMHJOVE1GVQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
      memberships: {
        create: {
          organizationId: organizations[1].id,
        },
      },
    },
  })
}

export default seed
