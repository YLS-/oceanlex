// React
import { useEffect, useRef, useState } from 'react'

export type Fetcher<TArgs, TData> = (args: TArgs, signal: AbortSignal) => Promise<TData>
export type QueryStatus = 'idle' | 'loading' | 'success' | 'error'


export function useQueryLite<TArgs, TData>(
	args: TArgs | null,                 // null disables the query
	fetcher: Fetcher<TArgs, TData>
) {
	const [data, setData] = useState<TData | null>(null)
	const [error, setError] = useState<unknown>(null)
	const [status, setStatus] = useState<QueryStatus>('idle')
	const abortRef = useRef<AbortController | null>(null)

	useEffect(() => {
		if (args == null) {
			// disabled: reset to idle and clear in-flight
			abortRef.current?.abort()
			setStatus('idle')
			setError(null)
			// keep previous data caller decides whether to show it
			return
		}

		setStatus('loading')
		setError(null)
		const ctrl = new AbortController()
		abortRef.current = ctrl;

		(async () => {
			try {
				const result = await fetcher(args, ctrl.signal)
				setData(result)
				setStatus('success')
			} catch (e: any) {
				if (e?.name === 'AbortError') return
				setError(e)
				setStatus('error')
			}
		})()

		return () => ctrl.abort()
	}, [args, fetcher])

	const abort = () => abortRef.current?.abort()

	return { data, error, status, abort }
}
