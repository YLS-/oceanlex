// Drizzle
import { pgTable, serial, integer, varchar, uniqueIndex, text, primaryKey } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Odyssee schemas
import { words } from './words'
import { meaningSentences } from './meaningSentences'
import { languages } from './languages'

// meanings belonging to a unique parent word
export const meanings = pgTable('meanings', {
   id: serial('id').primaryKey(),
   wordId: integer('word_id').notNull().references(() => words.id, { onDelete: 'cascade' }),
   order: integer('order').notNull(),                      // position in the word’s meanings[]

	pos: varchar('pos', { length: 8 }),			// part of speech (overriding word.pos if non-null)
}, (m) => [
	// enforce ordered meanings per word
   uniqueIndex('uniq_meanings_word_order').on(m.wordId, m.order)
])

// multilingual translations of a meaning
export const meaningTranslations = pgTable('meaning_translations', {
   meaningId: integer('meaning_id').notNull().references(() => meanings.id, { onDelete: 'cascade' }),
   lang: varchar('lang', { length: 8 }).notNull().references(() => languages.code, { onDelete: 'restrict' }),
   text: text('text').notNull()
}, (tr) => [
   primaryKey({ columns: [tr.meaningId, tr.lang] })
])

// meaning's array of sentence IDs
export const meaningsRelations = relations(meanings, ({ many, one }) => ({
   word: one(words, { fields: [meanings.wordId], references: [words.id] }),
   sentenceLinks: many(meaningSentences)
}))
