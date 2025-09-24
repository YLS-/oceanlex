import { useEffect, useMemo, useRef, useState } from 'react'

type Eq<T> = (a: T, b: T) => boolean
type KeyFn<T, K> = (v: T) => K

type DebounceOptions<T, K = unknown> = {
	/** ms delay before emitting */
	delay?: number

	/** equality check for comparing *emitted* values (default: Object.is) */
	equals?: Eq<T>

	/** derive a "key" used for distinctness if provided, distinctness is based on key */
	toKey?: KeyFn<T, K>
}

/**
 * Debounce any value and only emit when it changes (by `equals` or `toKey`).
 * - `toKey` normalizes/maps complex values for distinctness (e.g., trim strings).
 * - `equals` customizes equality (e.g., deep compare).
 */
export function useDebounced<T, K = unknown>(
	value: T,
	{ delay = 150, equals = Object.is, toKey }: DebounceOptions<T, K> = {}
): T {
	const [debounced, setDebounced] = useState<T>(value)
	const lastEmittedRef = useRef<T>(value)
	const lastKeyRef = useRef(toKey ? toKey(value) : undefined)

	// compute key (if any) with memo so it doesn’t thrash the effect deps
	const key = useMemo(() => (toKey ? toKey(value) : undefined), [toKey, value])

	useEffect(() => {
		const timeoutId = window.setTimeout(() => {
			// distinctness criteria: by key (if provided), else by equals on value
			const isDistinct: boolean = toKey
				? !Object.is(key, lastKeyRef.current)
				: !equals(value, lastEmittedRef.current)

			if (isDistinct) {
				lastEmittedRef.current = value
				if (toKey) lastKeyRef.current = key
				setDebounced(value)
			}
		}, delay)

		return () => window.clearTimeout(timeoutId)
	}, [value, key, delay, equals, toKey])

	return debounced
}
