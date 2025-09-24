// Next
import { notFound } from "next/navigation"

// Oceanlex models
import { isLanguageCode } from "@oceanlex/models"
import SearchArea from '@/components/search/SearchArea'


// params.lang come from the App Router
export default async function Home({ params }: { params: Promise<{ lang: string }> }) {

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h1 className="mb-2 text-2xl font-semibold tracking-tight">Dictionary</h1>
				<p className="text-sm text-gray-600">Search headwords. Autocomplete is backed by Postgres for now.</p>
			</div>

			<SearchArea />

		</div>)
}
