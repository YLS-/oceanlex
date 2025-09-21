import { pgTable, varchar } from "drizzle-orm/pg-core"

// https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
export const languages = pgTable('languages', {
	code: varchar('code', { length: 8 }).primaryKey(),
	name: varchar('name').notNull()
})
