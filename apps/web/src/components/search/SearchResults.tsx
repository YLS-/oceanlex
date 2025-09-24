'use client'
import { useLang } from '@/app/[lang]/LangContext'
import type { LanguageCode } from '@oceanlex/models'
import type { HeadwordSearchResult } from '@oceanlex/transport'
import PosTag from '@/components/ui/PosTag'

export default function SearchResults({ results }: { results: HeadwordSearchResult[] }) {
	const lang: LanguageCode = useLang()


	return (
		<ul className="absolute z-40 mt-2 w-full overflow-hidden rounded-xl border bg-zinc-800 shadow">
			{results.map(s => (
				<li key={s.wordId}>
					<a className="w-full px-4 py-2 hover:bg-zinc-700 flex flex-row items-center gap-x-4"
						href={`/${lang}/word/${s.wordId}`}>

						{/* PoS tag */}
						<div className='w-10 h-7 self-stretch flex items-center'>
							<PosTag pos={s.pos} />
						</div>

						{/* target language headword */}
						<div className='flex-grow text-lg font-medium'>
							{s.headwords[lang]}
						</div>

						{/* English headword */}
						<div className=' text-zinc-400'>
							{s.headwords['en']}
						</div>
					</a>
				</li>
			))}
		</ul>
	)
}
