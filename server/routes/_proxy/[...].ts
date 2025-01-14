import type { H3Event } from 'h3'
import { defu } from 'defu'
import { FetchError } from 'ofetch'

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Get the full path and remove the _proxy prefix
    const fullPath = event.path || ''
    const pathWithoutPrefix = fullPath.replace(/^\/_proxy\//, '')

    // Find the position of the first double underscore
    const doubleUnderscoreStart = pathWithoutPrefix.indexOf('__')
    const doubleUnderscoreEnd = pathWithoutPrefix.indexOf('__', doubleUnderscoreStart + 2)
    
    if (doubleUnderscoreStart === -1 || doubleUnderscoreEnd === -1) {
      throw createError({
        statusCode: 400,
        message: 'Invalid proxy URL format. Expected format: _proxy/__baseUrl__/path'
      })
    }

    // Extract base URL and remaining path
    const encodedBaseUrl = pathWithoutPrefix.slice(doubleUnderscoreStart + 2, doubleUnderscoreEnd)
    const baseURL = decodeURIComponent(encodedBaseUrl)
    const remainingPath = pathWithoutPrefix.slice(doubleUnderscoreEnd + 2)

    // Validate base URL
    try {
      new URL(baseURL)
    } catch {
      throw createError({
        statusCode: 400,
        message: 'Invalid base URL'
      })
    }

    // Construct target URL
    const targetURL = new URL(remainingPath, baseURL).toString()

    // Get original request headers
    const originalHeaders = getHeaders(event)

    // Configure proxy headers
    const proxyHeaders = defu({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': '*/*',
      'Accept-Language': originalHeaders['accept-language'],
      'Referer': baseURL,
    }, originalHeaders) as Record<string, string>

    // Remove problematic headers
    delete proxyHeaders['host']
    delete proxyHeaders['connection']
    delete proxyHeaders['content-length']

    // Forward the request with the same method and body
    console.log(`Proxying request to ${targetURL}`)
    const response = await $fetch.raw(targetURL, {
      method: event.method,
      headers: proxyHeaders,
      body: event.method !== 'GET' && event.method !== 'HEAD' ? await readBody(event) : undefined,
    })

    // Get response headers
    const responseHeaders = Object.fromEntries(response.headers.entries())

    // Set CORS headers
    responseHeaders['Access-Control-Allow-Origin'] = '*'
    responseHeaders['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    responseHeaders['Access-Control-Allow-Headers'] = '*'

    // Remove problematic response headers
    delete responseHeaders['content-encoding']
    delete responseHeaders['content-length']
    delete responseHeaders['transfer-encoding']

    // Set response headers
    setHeaders(event, responseHeaders)

    // Return the response
    return response._data
  } catch (error: unknown) {
    if (error instanceof FetchError) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.message || 'Proxy request failed'
      })
    }
    throw error
  }
})