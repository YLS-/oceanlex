import { LanguageCode, Sentence } from "@oceanlex/models"


export default function SentenceItem({ sentence, source, target }: { sentence: Sentence, source: LanguageCode, target: LanguageCode }) {
	return (
		<div className="flex flex-col gap-y-0">
			{/* source language sentence */}
			<div className="text-white text-sm">
				{sentence.text[source]}
			</div>

			{/* target language sentence */}
			<div className="text-zinc-500 text-xs">
				{sentence.text[target]}
			</div>
		</div>
	)
}
