import { ConvexHttpClient } from 'convex/browser'
import type {
  FunctionArgs,
  FunctionReference,
  FunctionReturnType
} from 'convex/server'
import { getFunctionName } from 'convex/server'
import type {
  AsyncData,
  AsyncDataOptions,
  AsyncDataRequestStatus
} from 'nuxt/app'
import type { MaybeRefOrGetter, Ref } from 'vue'
import { onScopeDispose, ref, toValue, watch } from 'vue'

type QueryReference = FunctionReference<'query'>

interface SubscriptionState<T> {
  data: Ref<T | null>
  error: Ref<Error | null>
  pending: Ref<boolean>
  status: Ref<AsyncDataRequestStatus>
}

export interface UseConvexQueryOptions<T> extends Omit<
  AsyncDataOptions<T>,
  'transform' | 'default'
> {
  ssr?: boolean
}

export async function useConvexQuery<Query extends QueryReference>(
  query: Query,
  args: MaybeRefOrGetter<FunctionArgs<Query>>,
  options: UseConvexQueryOptions<FunctionReturnType<Query>> = {}
): Promise<AsyncData<FunctionReturnType<Query> | null, Error | null>> {
  const nuxtApp = useNuxtApp()
  const convexUrl = useRuntimeConfig().public.convexUrl
  const client = import.meta.client ? useConvexClient() : null

  if (typeof convexUrl !== 'string' || convexUrl.length === 0) {
    return createErrorAsyncData(new Error('Convex URL not configured'))
  }

  const ssrEnabled = options.ssr ?? true
  const shouldUseSSR = ssrEnabled && (import.meta.server || nuxtApp.isHydrating)

  if (shouldUseSSR) {
    return useConvexQuerySSR(query, args, options, convexUrl, client)
  }

  return useConvexQueryClient(query, args, client)
}

async function useConvexQuerySSR<Query extends QueryReference>(
  query: Query,
  args: MaybeRefOrGetter<FunctionArgs<Query>>,
  options: UseConvexQueryOptions<FunctionReturnType<Query>>,
  convexUrl: string,
  client: ReturnType<typeof useConvexClient>
): Promise<AsyncData<FunctionReturnType<Query> | null, Error | null>> {
  const queryName = getFunctionName(query)
  const sortedArgs = sortObjectKeys(toValue(args))
  const key = `convex:${queryName}:${JSON.stringify(sortedArgs)}`

  const asyncData = await useAsyncData(
    key,
    async () => {
      const httpClient = new ConvexHttpClient(convexUrl)
      return httpClient.query(query, toValue(args))
    },
    { ...options, server: options.ssr ?? true }
  )

  if (import.meta.client && client) {
    setupClientSubscription(
      query,
      args,
      {
        data: asyncData.data as Ref<FunctionReturnType<Query> | null>,
        error: asyncData.error as Ref<Error | null>,
        pending: asyncData.pending,
        status: asyncData.status
      },
      client,
      false
    )
  }

  return asyncData as AsyncData<FunctionReturnType<Query> | null, Error | null>
}

function useConvexQueryClient<Query extends QueryReference>(
  query: Query,
  args: MaybeRefOrGetter<FunctionArgs<Query>>,
  client: ReturnType<typeof useConvexClient>
): AsyncData<FunctionReturnType<Query> | null, Error | null> {
  const data = ref<FunctionReturnType<Query> | null>(null)
  const error = ref<Error | null>(null)
  const pending = ref(true)
  const status = ref<AsyncDataRequestStatus>('pending')

  const state: SubscriptionState<FunctionReturnType<Query>> = {
    data,
    error,
    pending,
    status
  }

  const { refresh } = setupClientSubscription(query, args, state, client, true)

  const result = {
    data,
    pending,
    error,
    status,
    refresh,
    execute: refresh,
    clear: () => {
      data.value = null
      error.value = null
      pending.value = false
      status.value = 'idle'
    }
  }

  return result as AsyncData<FunctionReturnType<Query> | null, Error | null>
}

function setupClientSubscription<Query extends QueryReference>(
  query: Query,
  args: MaybeRefOrGetter<FunctionArgs<Query>>,
  state: SubscriptionState<FunctionReturnType<Query>>,
  client: ReturnType<typeof useConvexClient>,
  setPendingOnStart: boolean
): { refresh: () => Promise<void> } {
  if (!client) {
    state.pending.value = false
    state.status.value = 'error'
    state.error.value = new Error('Convex client not available')

    return {
      refresh: async () => {}
    }
  }

  let unsubscribe: (() => void) | null = null

  const subscribe = (markPending: boolean): void => {
    unsubscribe?.()

    if (markPending) {
      state.pending.value = true
      state.status.value = 'pending'
    }

    unsubscribe = client.onUpdate(
      query,
      toValue(args),
      (result) => {
        state.data.value = result as FunctionReturnType<Query>
        state.error.value = null
        state.pending.value = false
        state.status.value = 'success'
      },
      (subscriptionError) => {
        state.error.value = subscriptionError
        state.pending.value = false
        state.status.value = 'error'
      }
    )
  }

  subscribe(setPendingOnStart)

  watch(
    () => toValue(args),
    () => subscribe(true),
    { deep: true }
  )

  onScopeDispose(() => unsubscribe?.())

  return {
    refresh: async () => {
      subscribe(true)
    }
  }
}

function createErrorAsyncData<Query extends QueryReference>(
  error: Error
): AsyncData<FunctionReturnType<Query> | null, Error | null> {
  const result = {
    data: ref<FunctionReturnType<Query> | null>(null),
    pending: ref(false),
    error: ref<Error | null>(error),
    status: ref<AsyncDataRequestStatus>('error'),
    refresh: async () => {},
    execute: async () => {},
    clear: () => {}
  }

  return result as AsyncData<FunctionReturnType<Query> | null, Error | null>
}

function sortObjectKeys<T>(value: T): T {
  if (value === null || typeof value !== 'object') {
    return value
  }

  if (Array.isArray(value)) {
    return value.map(sortObjectKeys) as T
  }

  const sorted: Record<string, unknown> = {}
  for (const key of Object.keys(value as Record<string, unknown>).sort()) {
    sorted[key] = sortObjectKeys((value as Record<string, unknown>)[key])
  }

  return sorted as T
}
