import { httpRouter } from 'convex/server'
import type { GenericId } from 'convex/values'
import { authComponent, createAuth } from './auth'
import { httpAction } from './_generated/server'
import { internal } from './_generated/api'

const http = httpRouter()

authComponent.registerRoutes(http, createAuth)

http.route({
  path: '/api/check-role',
  method: 'GET',
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url)
    const eventId = url.searchParams.get('eventId')
    const role = url.searchParams.get('role')

    if (!eventId || !role) {
      return new Response(
        JSON.stringify({ hasRole: false, error: 'Missing eventId or role' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (role !== 'planner' && role !== 'scanner') {
      return new Response(
        JSON.stringify({ hasRole: false, error: 'Invalid role' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const auth = createAuth(ctx)
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session?.user) {
      return new Response(JSON.stringify({ hasRole: false }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const userId = session.user.id as GenericId<'user'>

    let result: { hasRole: boolean }
    try {
      result = await ctx.runQuery(internal.eventRoles.internalCheckRole, {
        userId,
        eventId: eventId as GenericId<'events'>,
        requiredRole: role
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : ''
      if (message.includes('ArgumentValidationError')) {
        const errorMessage = message.includes('eventId')
          ? 'Invalid eventId'
          : 'Invalid request arguments'

        return new Response(
          JSON.stringify({ hasRole: false, error: errorMessage }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }

      throw error
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  })
})

export default http
