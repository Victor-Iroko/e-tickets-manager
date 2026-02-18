import { joinURL } from 'ufo'

export default defineEventHandler(async (event) => {
  const convexSiteUrl = useRuntimeConfig().convexSiteUrl
  const query = getQuery(event)

  const eventId = query.eventId as string | undefined
  const role = query.role as string | undefined

  if (!eventId || !role) {
    throw createError({ statusCode: 400, message: 'Missing eventId or role' })
  }

  const proxyUrl =
    joinURL(convexSiteUrl, '/api/check-role') +
    `?eventId=${encodeURIComponent(eventId)}&role=${encodeURIComponent(role)}`

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
