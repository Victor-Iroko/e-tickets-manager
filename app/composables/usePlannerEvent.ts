import type { Doc, Id } from '~~/convex/_generated/dataModel'

interface PlannerEventContext {
  event: Ref<Doc<'events'> | null>
  eventId: ComputedRef<Id<'events'>>
  isLoading: ComputedRef<boolean>
  isDraft: ComputedRef<boolean>
  isOnSale: ComputedRef<boolean>
}

const PLANNER_EVENT_KEY = 'planner-event-context'

/**
 * Provide planner event context from the layout.
 */
export function providePlannerEvent(ctx: PlannerEventContext) {
  provide(PLANNER_EVENT_KEY, ctx)
}

/**
 * Inject planner event context in sub-pages.
 * Must be used within a page that uses the planner-event layout.
 */
export function usePlannerEvent(): PlannerEventContext {
  const ctx = inject<PlannerEventContext>(PLANNER_EVENT_KEY)
  if (!ctx) {
    throw new Error(
      'usePlannerEvent() must be used within the planner-event layout'
    )
  }
  return ctx
}
