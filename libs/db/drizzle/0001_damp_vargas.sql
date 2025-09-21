CREATE TABLE "languages" (
	"code" varchar(8) PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meaning_sentences" (
	"meaning_id" integer NOT NULL,
	"sentence_id" integer NOT NULL,
	"order" integer NOT NULL,
	CONSTRAINT "meaning_sentences_meaning_id_sentence_id_pk" PRIMARY KEY("meaning_id","sentence_id")
);
--> statement-breakpoint
CREATE TABLE "meanings" (
	"id" serial PRIMARY KEY NOT NULL,
	"word_id" integer NOT NULL,
	"order" integer NOT NULL,
	"pos" varchar(8)
);
--> statement-breakpoint
CREATE TABLE "sentences" (
	"id" serial PRIMARY KEY NOT NULL,
	"firestore_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "words" ADD COLUMN "firestore_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "words" ADD COLUMN "phonetic" text;--> statement-breakpoint
ALTER TABLE "words" ADD COLUMN "pos" varchar(8);--> statement-breakpoint
ALTER TABLE "words" ADD COLUMN "lexeme_tags" varchar(20);--> statement-breakpoint
ALTER TABLE "meaning_sentences" ADD CONSTRAINT "meaning_sentences_meaning_id_meanings_id_fk" FOREIGN KEY ("meaning_id") REFERENCES "public"."meanings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meaning_sentences" ADD CONSTRAINT "meaning_sentences_sentence_id_sentences_id_fk" FOREIGN KEY ("sentence_id") REFERENCES "public"."sentences"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meanings" ADD CONSTRAINT "meanings_word_id_words_id_fk" FOREIGN KEY ("word_id") REFERENCES "public"."words"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_meanings_word_order" ON "meanings" USING btree ("word_id","order");--> statement-breakpoint
ALTER TABLE "words" ADD CONSTRAINT "words_lang_languages_code_fk" FOREIGN KEY ("lang") REFERENCES "public"."languages"("code") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "words" DROP COLUMN "headword";--> statement-breakpoint
ALTER TABLE "words" DROP COLUMN "created_at";