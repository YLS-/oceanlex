import 'dotenv/config'
import { db, schema } from '@oceanlex/db'
const { languages } = schema

const CODES = [
	['en', 'English'],
	['fr', 'Français'],
	['ja', '日本語'],
	['zh', '中文'],
	['th', 'ไทย'],
	['id', 'Bahasa Indonesia'],
] as const

async function main() {
	const rows = CODES.map(([code, name]) => ({ code, name }))

	await db
		.insert(languages)
		.values(rows)
		.onConflictDoNothing() // pk(code)

	console.log('✅ languages seeded')
	process.exit(0)
}

main().catch(e => { console.error(e); process.exit(1) })
