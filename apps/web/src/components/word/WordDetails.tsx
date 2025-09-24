import type { LanguageCode, Word } from "@oceanlex/models"
import MeaningItem from "./MeaningItem"
import PosTag from "@/components/PosTag"


export default function WordDetails({ word, lang }: { word: Word, lang: LanguageCode }) {
	return (
		<div className="p-4 rounded-xl bg-black/90 backdrop-blur select-none flex flex-col gap-y-6">
			{/* word header */}
			<section className='flex flex-col gap-y-2'>
				{/* header top row (PoS, level) */}
				<div className='w-10 self-stretch pt-1 flex items-center'>
					<PosTag pos={word.pos} />
				</div>

				{/* header bottom row (headword, phonetic) */}
				<div className="flex flex-row gap-x-3 items-end">
					{/* headword */}
					<h1 className="text-3xl font-semibold tracking-tight whitespace-nowrap text-left">
						{word.headwords[lang]}
					</h1>

					{/* phonetic */}
					{word.phonetic && (
						<div className="h-4 mb-1.5 text-base leading-4 text-zinc-600">
							{ '[' + word.phonetic + ']' }
						</div>
					)}
				</div>
			</section>

			{/* meanings */}
			<section className="flex flex-col gap-y-4">
				{ word.meanings.map((m, i) => (
					<MeaningItem key={i} meaning={m} source={lang} target={'en'} />
				))}
			</section>
		</div>
	)
}
