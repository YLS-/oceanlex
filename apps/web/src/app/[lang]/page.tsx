import { LanguageCode } from "@oceanlex/models"
import SearchBox from '@/components/search/SearchBox'

// params.lang come from the App Router
export default async function Home({ params }: { params: { lang: LanguageCode } }) {
	return (
		<div className="space-y-6">
			<div className="text-center">
				<h1 className="mb-2 text-2xl font-semibold tracking-tight">Dictionary</h1>
				<p className="text-sm text-gray-600">Search headwords. Autocomplete is backed by Postgres for now.</p>
			</div>

			<SearchBox />

		</div>)
}
