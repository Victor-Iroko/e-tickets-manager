import type {
  FunctionArgs,
  FunctionReference,
  FunctionReturnType
} from 'convex/server'

export function useConvexMutation<
  Mutation extends FunctionReference<'mutation'>
>(mutation: Mutation) {
  const client = useConvexClient()
  const isPending = ref(false)
  const error = ref<Error | null>(null)

  const mutate = async (
    args: FunctionArgs<Mutation>
  ): Promise<FunctionReturnType<Mutation>> => {
    if (!client) {
      const mutationError = new Error('Convex client not available')
      error.value = mutationError
      throw mutationError
    }

    isPending.value = true
    error.value = null

    try {
      return await client.mutation(mutation, args)
    } catch (caughtError) {
      const mutationError =
        caughtError instanceof Error
          ? caughtError
          : new Error('Failed to run mutation')
      error.value = mutationError
      throw mutationError
    } finally {
      isPending.value = false
    }
  }

  return {
    mutate,
    isPending: readonly(isPending),
    error: readonly(error)
  }
}
