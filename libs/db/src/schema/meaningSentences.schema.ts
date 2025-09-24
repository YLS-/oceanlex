// Drizzle
import { pgTable, primaryKey, integer, uniqueIndex } from 'drizzle-orm/pg-core'

// Odyssee schemas
import { sentences$ } from './sentences.schema'
import { meanings$ } from './meanings.schema'

// link table for meaning-sentence relationships
export const meaningSentences$ = pgTable('meaning_sentences', {
   meaningId: integer('meaning_id').notNull().references(() => meanings$.id, { onDelete: 'cascade' }),
   sentenceId: integer('sentence_id').notNull().references(() => sentences$.id, { onDelete: 'cascade' }),
   order: integer('order').notNull()           // preserve sentence ordering per meaning
}, (s) => [
   primaryKey({ columns: [s.meaningId, s.sentenceId] }),
	// enforce ordered sentences per meaning
	uniqueIndex('uniq_meaning_sentence_order').on(s.meaningId, s.order)
])
