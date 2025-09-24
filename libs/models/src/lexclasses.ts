
export const LEXICAL_CLASSES = <const>['N', 'ADJ', 'ADV', 'V', 'PREP', 'POST', 'PART', 'CONJ', 'DET', 'MW', 'NUM', 'PN', 'INT', 'EXP']
export type LexicalClass = typeof LEXICAL_CLASSES[number]

export const LEXICAL_CLASSES_EN: Record<LexicalClass, string> = {
	// open classes
	N: "noun",
	ADJ: "adj",
	V: "verb",
	ADV: "adv",

	// closed classes
	DET: "det",
	MW: "mw",
	NUM: "num",
	PN: "pron",
	PREP: "prep",
	POST: "post",
	PART: "part",
	CONJ: "conj",
	INT: "interj",
	EXP: "idiom",
}

export const LEXICAL_CLASSES_EN_FULL: Record<LexicalClass, string> = {
	// open classes
	N: "noun",
	ADJ: "adjective",
	V: "verb",
	ADV: "adverb",

	// closed classes
	DET: "determiner",
	MW: "measure-word",
	NUM: "numeral",
	PN: "pronoun",
	PREP: "preposition",
	POST: "postposition",
	PART: "particle",
	CONJ: "conjunction",
	INT: "interjection",
	EXP: "idiom",
}

export const LEXICAL_CLASSES_JA: Record<LexicalClass, string> = {
	// open classes
	N: "名詞",
	ADJ: "形容詞",
	V: "動詞",
	ADV: "副詞",

	// closed classes
	DET: "限定詞",
	MW: "助数詞",
	NUM: "数詞",
	PN: "代名詞",
	PREP: "前置詞",
	POST: "後置詞",
	PART: "助詞",
	CONJ: "接続詞",
	INT: "間投詞",
	EXP: "熟語",
}


export const LEXICAL_CLASSES_COLORS: Record<LexicalClass, string> = {
	// nominal group (cold colors)
	N: 	'hsl(225deg 60% 50%)',		// desaturated blue
	PN: 	'hsl(120deg 45% 30%)', 		// dark green
	ADJ: 	'mediumturquoise',			// turquoise
	DET:	'hsl(190deg 80% 43%)', 		// light blue
	NUM: 	'hsl(190deg 80% 43%)',		// light blue
	MW: 	'hsl(190deg 80% 43%)',		// light blue

	// verbal group (warm colors)
	ADV: 	'hsl(33deg 80% 50%)',		// desaturated darker orange
	V: 	'hsl(350deg 80% 45%)',		// desaturated crimon red

	// connectors
	PREP: 'hsl(280deg 45% 50%)',		// darker purple
	POST: 'hsl(280deg 45% 50%)',		// darker purple
	PART: 'hsl(280deg 45% 50%)',		// darker purple
	CONJ: 'hsl(0deg 0% 40%)',			// darker gray

	// other
	INT: 	'goldenrod',
	EXP: 	'#AB9786'
}

