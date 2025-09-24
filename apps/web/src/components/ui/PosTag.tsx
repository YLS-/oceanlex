import { memo } from 'react'
import { LexicalClass, LEXICAL_CLASSES_EN, LEXICAL_CLASSES_COLORS } from '@oceanlex/models'

function PosTag({ pos }: { pos: LexicalClass | null }) {
	const label: string = pos ? LEXICAL_CLASSES_EN[pos]! : '?'
	const bgColor: string = pos ? LEXICAL_CLASSES_COLORS[pos]! : '#3f3f46' 	// fallback to zinc-700

	return (
		<span className='rounded-lg px-1.5 py-0.5 bg-zinc-700 text-white font-medium text-xs saturate-[.75]'
			style={{ backgroundColor: bgColor }}
			aria-label={`Part of speech: ${label}`}>
			{label}
		</span>
	)
}

// Memoized: will not re-render unless `pos` changes
export default memo(PosTag)
