import { searchHeadwords } from './queries/search-headwords'
import { getWord } from './queries/get-word'


// run with:
// ts-node src/dev.ts

async function main() {
	// testHeadwords()
	testWords()
}

main().catch(err => {
	console.error(err)
	process.exit(1)
})


async function testHeadwords() {
	const headwords = await searchHeadwords({
		sourceLang: 'fr',
		targetLang: 'en',
		prefix: 'rue',
		mode: 'around',
		limit: 5
	})

	console.dir(headwords, { depth: null, colors: true })
}

async function testWords() {
	const word = await getWord({ wordId: 'f8lErjrEIXUfFy1GJQwt' })
	console.dir(word, { depth: null, colors: true })
}
