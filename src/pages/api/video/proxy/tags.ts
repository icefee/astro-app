import type { APIRoute } from 'astro'
import { proxyRequest } from '@adaptors/.'
import { getApiUrl } from '.'

export const GET: APIRoute = () => proxyRequest(getApiUrl('category'))