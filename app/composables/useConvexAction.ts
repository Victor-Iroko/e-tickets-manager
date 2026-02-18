import type {
  FunctionArgs,
  FunctionReference,
  FunctionReturnType
} from 'convex/server'

export function useConvexAction<Action extends FunctionReference<'action'>>(
  action: Action
) {
  const client = useConvexClient()
  const isPending = ref(false)
  const error = ref<Error | null>(null)

  const execute = async (
    args: FunctionArgs<Action>
  ): Promise<FunctionReturnType<Action>> => {
    if (!client) {
      const actionError = new Error('Convex client not available')
      error.value = actionError
      throw actionError
    }

    isPending.value = true
    error.value = null

    try {
      return await client.action(action, args)
    } catch (caughtError) {
      const actionError =
        caughtError instanceof Error
          ? caughtError
          : new Error('Failed to run action')
      error.value = actionError
      throw actionError
    } finally {
      isPending.value = false
    }
  }

  return {
    execute,
    isPending: readonly(isPending),
    error: readonly(error)
  }
}
