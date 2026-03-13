import { createClient } from '@supabase/supabase-js'

function normalizeSupabaseUrl(raw: unknown): string {
	if (typeof raw !== 'string') return ''
	let url = raw.trim()
	if (!url) return ''

	// Allow config values like "dvvttcbp....supabase.co" by auto-prefixing.
	if (!/^https?:\/\//i.test(url)) {
		url = `https://${url}`
	}

	// Trim trailing slashes to keep URL joins consistent.
	url = url.replace(/\/+$/, '')
	return url
}

const supabaseUrl = normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL)
const supabaseAnonKey = typeof import.meta.env.VITE_SUPABASE_ANON_KEY === 'string'
	? import.meta.env.VITE_SUPABASE_ANON_KEY.trim()
	: ''

if (!supabaseUrl || !supabaseAnonKey) {
	// Throwing here is intentional: it prevents silent hangs/timeouts later.
	// Do NOT log keys.
	const missing = [
		!supabaseUrl ? 'VITE_SUPABASE_URL' : null,
		!supabaseAnonKey ? 'VITE_SUPABASE_ANON_KEY' : null,
	].filter(Boolean).join(', ')
	throw new Error(`Missing Supabase environment variables: ${missing}. Add them to .env.local (gitignored) and restart the dev server.`)
}

if (import.meta.env.DEV) {
	// Non-sensitive diagnostic to confirm what the browser is using.
	// Helpful when signup works in Node but times out in the browser.
	console.info('[supabase] configured', { url: supabaseUrl, anonKeyLength: supabaseAnonKey.length })
}

const debugFetch: typeof fetch | undefined = import.meta.env.DEV
	? (async (input, init) => {
			const rawUrl = typeof input === 'string'
				? input
				: input instanceof URL
					? input.toString()
					: input.url

			let safeUrl = rawUrl
			try {
				const u = new URL(rawUrl)
				safeUrl = `${u.origin}${u.pathname}`
			} catch {
				// Leave as-is for relative or invalid URLs (still useful for diagnosis)
			}

			const method = (init?.method ?? 'GET').toUpperCase()
			const started = typeof performance !== 'undefined' ? performance.now() : Date.now()

			try {
				const res = await fetch(input, init)
				const ended = typeof performance !== 'undefined' ? performance.now() : Date.now()
				if (!res.ok) {
					try {
						const cloned = res.clone()
						const ct = cloned.headers.get('content-type') || ''
						const body = ct.includes('application/json')
							? await cloned.json()
							: await cloned.text()
						console.warn('[supabase fetch body]', method, safeUrl, res.status, body)
					} catch {
						// Ignore body parse errors
					}
				}
				console.info('[supabase fetch]', method, safeUrl, res.status, `${Math.round(ended - started)}ms`)
				return res
			} catch (err) {
				const ended = typeof performance !== 'undefined' ? performance.now() : Date.now()
				console.warn('[supabase fetch error]', method, safeUrl, `${Math.round(ended - started)}ms`, err)
				throw err
			} finally {
			}
		})
	: undefined

export const supabase = createClient(
	supabaseUrl,
	supabaseAnonKey,
	{
		...(debugFetch ? { global: { fetch: debugFetch } } : {}),
		auth: {
			autoRefreshToken: true,
			persistSession: true,
			detectSessionInUrl: true,
		},
	}
)
