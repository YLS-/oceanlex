'use client'
import React from 'react'

type Props = {
	value: string
	onChange: (v: string) => void
	placeholder?: string
	className?: string
}

export default function SearchBox({ value, onChange, placeholder, className }: Props) {
	return (
		<input
			className={`w-full rounded-2xl border px-4 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 ${className ?? ''}`}
			autoFocus
			value={value}
			placeholder={placeholder ?? 'Type a headword…'}
			onChange={(e) => onChange(e.target.value)}
		/>
	)
}
