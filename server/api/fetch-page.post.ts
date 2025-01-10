import type { H3Event } from 'h3'

interface RequestBody {
    url: string
}

interface FetchError {
    status?: number
    statusCode?: number
    message: string
    response?: {
        status: number
        statusText: string
    }
}

export default defineEventHandler(async (event: H3Event) => {
    try {
        const body = await readBody<RequestBody>(event)

        if (!body?.url) {
            throw createError({
                statusCode: 400,
                message: 'URL is required'
            })
        }

        // Validate URL format
        try {
            new URL(body.url)
        } catch {
            throw createError({
                statusCode: 400,
                message: 'Invalid URL format'
            })
        }

        try {
            const html = await $fetch<string>(body.url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            })

            return { html: rewriteHtmlUrls(html, body.url) }
        } catch (fetchError) {
            const error = fetchError as FetchError
            throw createError({
                statusCode: error.response?.status || 500,
                message: error.message || 'Failed to fetch the webpage'
            })
        }
    } catch (error) {
        const e = error as FetchError
        throw createError({
            statusCode: e.statusCode || 500,
            message: e.message || 'Internal server error'
        })
    }
})

/**
 * Rewrites URLs to use the proxy, handling both relative and absolute URLs
 * @param url The original URL (can be relative or absolute)
 * @param baseUrl The base URL of the original resource
 * @returns The rewritten URL that goes through the proxy
 */
function rewriteUrl(url: string, baseUrl: string): string {
    try {
        // Remove leading and trailing whitespace
        url = url.trim()

        // Handle empty or invalid URLs
        if (!url || url.startsWith('data:') || url.startsWith('blob:')) {
            return url
        }

        // Extract the origin and path from the target URL
        const parsedTarget = new URL(url, baseUrl)
        const targetUrl = parsedTarget.toString()
        const origin = parsedTarget.origin
        const path = targetUrl.slice(origin.length + 1) // +1 for the trailing slash

        // Construct the proxy URL
        return `/_proxy/__${encodeURIComponent(origin)}__/${path}`
    } catch (error) {
        console.error('Error rewriting URL:', error)
        return url // Return original URL if something goes wrong
    }
}

function rewriteHtmlUrls(html: string, baseUrl: string) {
    html = html.replace(
        /(src|href)=["'](\/[^"']*|[^"'/][^"']*)['"]/g,
        (match, attr, url) => {
            if (url.startsWith('//')) { // prefetch
                return match
            }
            return `${attr}="${rewriteUrl(url, baseUrl)}"`
        }
    )
    // Similar for href, url(), etc.
    return html
}