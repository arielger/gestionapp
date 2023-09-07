import db from "./index"

/*
 * This seed function is executed when you run `blitz db seed`.
 *
 * Probably you want to use a library like https://chancejs.com
 * to easily generate realistic data.
 */

const seed = async () => {
  const realStateAgency = await db.realStateAgency.create({
    data: {
      name: "Gestionar",
    },
  })

  await db.user.create({
    data: {
      email: "test@test.com",
      name: "Juan Real State",
      // password = test123456
      hashedPassword:
        "JGFyZ29uMmlkJHY9MTkkbT02NTUzNix0PTIscD0xJHRBTVZYYzBMWmlTRUh4WjY5bTAxQVEkcnJJVE45elJOcUxjbmVNc3hLUkU2eTZsVmYzbVlHT2dqbFNaMHJOVE1GVQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
      realStateAgencyId: realStateAgency.id,
    },
  })
}

export default seed
