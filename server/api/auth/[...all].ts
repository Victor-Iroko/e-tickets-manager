export default defineEventHandler(async (event) => {
  const auth = createServerAuth()
  const request = toWebRequest(event)
  return auth.handler(request)
})
