async function getStats() {
	const apiUrl = process.env.NEXT_PUBLIC_API_URL
	const res = await fetch(`${apiUrl}/health`, { cache: 'no-store' })
	if (!res.ok) throw new Error('API error')
	return res.json()
}

export default async function Page() {
	const data = await getStats()
	return <pre>{JSON.stringify(data, null, 2)}</pre>
}
