// Drizzle
import { pgTable, serial, text, varchar, integer, primaryKey, uniqueIndex } from 'drizzle-orm/pg-core'

// Odyssee schemas
import { languages } from './languages'

export const sentences = pgTable('sentences', {
   id: serial('id').primaryKey(),
   firestoreId: text('firestore_id').notNull()
})

// normalize (flatten) sentence text by language
// i.e. composite primary key: '00un5KJ5DrT8Dt1htcdQ_en', '00un5KJ5DrT8Dt1htcdQ_fr', etc
export const sentenceTexts = pgTable('sentence_texts', {
   sentenceId: integer('sentence_id').notNull().references(() => sentences.id, { onDelete: 'cascade' }),
   lang: varchar('lang', { length: 8 }).notNull().references(() => languages.code, { onDelete: 'restrict' }),
   text: text('text').notNull()
}, (t) => [
   primaryKey({ columns: [t.sentenceId, t.lang] }),
   // Optional: prevent exact duplicates per language
	//! constraint probably not respected in the current Odyssee DB, a few sentences have duplicate text
	//! -> yep, failed on 'Key (lang, text)=(ja, 私は毎週両親に電話する。) already exists.'
   // uniqueIndex('uniq_sentence_text_lang_text').on(t.lang, t.text)
])
