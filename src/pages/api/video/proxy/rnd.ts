import type { APIRoute } from 'astro'
import { proxyRequest } from '@adaptors/common'
import { getApiUrl } from '.'

export const GET: APIRoute = () => proxyRequest(getApiUrl('index_rmd'))