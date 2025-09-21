import 'dotenv/config'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { db } from './client'

async function main() {
	await migrate(db, { migrationsFolder: './drizzle' })
	console.log('✅ migrations applied')
	process.exit(0)
}

main().catch(e => { console.error(e); process.exit(1) })
