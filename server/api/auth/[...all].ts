import { joinURL } from 'ufo'

export default defineEventHandler(async (event) => {
  const convexSiteUrl = useRuntimeConfig().convexSiteUrl
  const apiPath = '/api/auth'
  const pathParams = getRouterParam(event, 'all') || ''
  const queryString = getRequestURL(event).search

  const proxyUrl = joinURL(convexSiteUrl, apiPath, pathParams) + queryString

  return proxyRequest(event, proxyUrl, {
    fetchOptions: {
      redirect: 'manual',
      headers: {
        ...getProxyRequestHeaders(event),
        Host: new URL(convexSiteUrl).host,
        'X-Forwarded-Host': getRequestHost(event),
        'X-Forwarded-Proto': getRequestProtocol(event)
      }
    }
  })
})
