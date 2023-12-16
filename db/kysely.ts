import { DB } from "./types/index" // this is the Database interface we defined earlier
import { Pool } from "pg"
import { Kysely, PostgresDialect } from "kysely"

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
})

export const kyselyDb = new Kysely<DB>({
  dialect,
})
