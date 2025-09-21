CREATE TABLE "word_headwords" (
	"word_id" integer NOT NULL,
	"lang" varchar(8) NOT NULL,
	"text" text NOT NULL,
	CONSTRAINT "word_headwords_word_id_lang_pk" PRIMARY KEY("word_id","lang")
);
--> statement-breakpoint
CREATE TABLE "meaning_translations" (
	"meaning_id" integer NOT NULL,
	"lang" varchar(8) NOT NULL,
	"text" text NOT NULL,
	CONSTRAINT "meaning_translations_meaning_id_lang_pk" PRIMARY KEY("meaning_id","lang")
);
--> statement-breakpoint
CREATE TABLE "sentence_texts" (
	"sentence_id" integer NOT NULL,
	"lang" varchar(8) NOT NULL,
	"text" text NOT NULL,
	CONSTRAINT "sentence_texts_sentence_id_lang_pk" PRIMARY KEY("sentence_id","lang")
);
--> statement-breakpoint
ALTER TABLE "word_headwords" ADD CONSTRAINT "word_headwords_word_id_words_id_fk" FOREIGN KEY ("word_id") REFERENCES "public"."words"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "word_headwords" ADD CONSTRAINT "word_headwords_lang_languages_code_fk" FOREIGN KEY ("lang") REFERENCES "public"."languages"("code") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meaning_translations" ADD CONSTRAINT "meaning_translations_meaning_id_meanings_id_fk" FOREIGN KEY ("meaning_id") REFERENCES "public"."meanings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meaning_translations" ADD CONSTRAINT "meaning_translations_lang_languages_code_fk" FOREIGN KEY ("lang") REFERENCES "public"."languages"("code") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sentence_texts" ADD CONSTRAINT "sentence_texts_sentence_id_sentences_id_fk" FOREIGN KEY ("sentence_id") REFERENCES "public"."sentences"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sentence_texts" ADD CONSTRAINT "sentence_texts_lang_languages_code_fk" FOREIGN KEY ("lang") REFERENCES "public"."languages"("code") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_sentence_text_lang_text" ON "sentence_texts" USING btree ("lang","text");