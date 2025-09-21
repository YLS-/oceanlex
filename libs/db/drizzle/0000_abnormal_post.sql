CREATE TABLE "words" (
	"id" serial PRIMARY KEY NOT NULL,
	"lang" varchar(8) NOT NULL,
	"headword" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
