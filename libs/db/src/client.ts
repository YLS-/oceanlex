import 'dotenv/config'
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const { DATABASE_URL } = process.env
if (!DATABASE_URL) throw new Error('DATABASE_URL is missing')

const pool = new Pool({
	connectionString: DATABASE_URL
})

export type Schema = NodePgDatabase<typeof schema>
export const db: Schema = drizzle(pool, { schema })
// export { schema }
