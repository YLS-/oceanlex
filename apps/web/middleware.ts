import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const validLanguages = new Set(['fr', 'ja', 'zh', 'id'])

export function middleware(req: NextRequest) {
	const { basePath, pathname } = req.nextUrl
	console.log('middleware',{ basePath, pathname })

	if (req.nextUrl.pathname === '/') {
		return new NextResponse(JSON.stringify({ mw: 'running' }), {
			status: 200,
			headers: { 'content-type': 'application/json' },
		})
	}

  // Redirect the bare "/" to either cookieLang or default "fr"
  if (pathname === '/' || pathname === basePath + '/') {
		const cookieLang = req.cookies.get('ol_lang')?.value
		const lang = cookieLang && validLanguages.has(cookieLang) ? cookieLang : 'fr'
		console.log({ cookieLang, lang })

		// building redirect URL
		const url = req.nextUrl.clone()
		url.pathname = `${basePath}/${lang}`
		const response = NextResponse.redirect(url)
		response.headers.set('x-middleware-redirect', 'hit')
		console.log('redirect', response)
		return response
	}

	// Redirect to canonical path
	return NextResponse.next()
}

// Only run on the root path
export const config = { matcher: ['/'] }
