import { searchHeadwords } from './queries/headwords'

// run with:
// ts-node src/dev.ts

async function main() {
	const results = await searchHeadwords({
		sourceLang: 'fr',
		targetLang: 'en',
		prefix: 'rue',
		mode: 'around',
		limit: 5
	})

	console.dir(results, { depth: null, colors: true })
}

main().catch(err => {
	console.error(err)
	process.exit(1)
})
