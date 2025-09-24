import { LanguageCode, Meaning } from "@oceanlex/models"
import SentenceItem from "./SentenceItem"


export default function MeaningItem({ meaning, source, target }: { meaning: Meaning, source: LanguageCode, target: LanguageCode }) {
	return (
		<div className="rounded-xl px-2.5 py-2 bg-zinc-800 flex flex-col gap-y-2">
			{/* meaning header */}
			<div className="flex-grow text-[18px] leading-5 text-amber-500 saturate-50 font-medium">
				{meaning.translations[target]}
			</div>

			{/* meaning sentences */}
			<div className="flex flex-col gap-y-2">
				{meaning.sentences.map((sentence) => (
					<SentenceItem key={sentence.id} sentence={sentence} source={source} target={target} />
				))}
			</div>
		</div>
	)
}
