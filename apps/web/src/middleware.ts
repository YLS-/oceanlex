import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const validLanguages = new Set(['fr', 'ja', 'zh', 'id'])

export function middleware(req: NextRequest) {
	const { basePath, pathname } = req.nextUrl

  // Redirect the bare "/" to either cookieLang or default "fr"
  if (pathname === '/' || pathname === basePath + '/') {
		const cookieLang = req.cookies.get('ol_lang')?.value
		const lang = cookieLang && validLanguages.has(cookieLang) ? cookieLang : 'fr'

		// building redirect URL
		const url = req.nextUrl.clone()
		url.pathname = `${basePath}/${lang}`
		return NextResponse.redirect(url)
	}

	// Redirect to canonical path
	return NextResponse.next()
}

// Only run on the root path
export const config = { matcher: ['/'] }
