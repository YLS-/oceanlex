import { pgTable, serial, text, varchar, timestamp } from 'drizzle-orm/pg-core'

export const words = pgTable('words', {
	id: serial('id').primaryKey(),
	lang: varchar('lang', { length: 8 }).notNull(),
	headword: text('headword').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
})
