// Drizzle
import { pgTable, serial, text, varchar, integer, primaryKey } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Odyssee schemas
import { languages$ } from './languages.schema'
import { meanings$ } from './meanings.schema'

// dictionary entries
export const words$ = pgTable('words', {
	id: serial('id').primaryKey(),
	firestoreId: text('firestore_id').notNull(),
	// dictionary language that the entry belongs to
	lang: varchar('lang', { length: 8 }).notNull().references(() => languages$.code, { onDelete: 'restrict' }),

	phonetic: text('phonetic'),
	pos: varchar('pos', { length: 8 }),
	lexeme_tags: varchar('lexeme_tags', { length: 20 })
})

// multilingual headwords
export const wordHeadwords$ = pgTable('word_headwords', {
	wordId: integer('word_id').notNull().references(() => words$.id, { onDelete: 'cascade' }),
	lang: varchar('lang', { length: 8 }).notNull().references(() => languages$.code, { onDelete: 'restrict' }),
	text: text('text').notNull()
}, (h) => [
	primaryKey({ columns: [h.wordId, h.lang] })
])

// word's array of meanings
export const wordsMeanings = relations(words$, ({ many }) => ({
	meanings: many(meanings$)
}))

// ---- Row model types (DB shape) ----
export type WordRow = typeof words$.$inferSelect
