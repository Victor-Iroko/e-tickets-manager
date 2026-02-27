<script setup lang="ts">
import type { FormError } from '@nuxt/ui'
import type { Id } from '~~/convex/_generated/dataModel'
import { api } from '~~/convex/_generated/api'
import { formatPrice } from '~/utils/date-helpers'

definePageMeta({
  layout: 'planner-event',
  requiredRole: 'planner'
})

const { event, eventId, isDraft } = usePlannerEvent()
const toast = useToast()

useSeoMeta({
  title: computed(() => `Tickets — ${event.value?.name || 'Event'} — Ticketly`)
})

const { data: ticketTypes } = await useConvexQuery(
  api.ticketTypes.listByEvent,
  computed(() => ({ eventId: eventId.value }))
)

const { mutate: createTicketType, isPending: isCreating } = useConvexMutation(
  api.ticketTypes.createTicketType
)
const { mutate: updateTicketType, isPending: isUpdating } = useConvexMutation(
  api.ticketTypes.updateTicketType
)
const { mutate: deleteTicketType, isPending: isDeleting } = useConvexMutation(
  api.ticketTypes.deleteTicketType
)

// Modal state
const isModalOpen = ref(false)
const editingTicketId = ref<Id<'ticketTypes'> | null>(null)
const isDeleteModalOpen = ref(false)
const deletingTicketId = ref<Id<'ticketTypes'> | null>(null)

const formState = reactive({
  name: '',
  price: 0,
  totalQuantity: 1,
  metadata: [] as { key: string; value: string }[]
})

// Computed summary stats
const ticketTypeList = computed(() => ticketTypes.value ?? [])
const hasTicketTypes = computed(() => ticketTypeList.value.length > 0)
const hasLoadedTicketTypes = computed(() => ticketTypes.value !== null)

const totalCapacity = computed(() =>
  ticketTypeList.value.reduce((sum, t) => sum + t.totalQuantity, 0)
)
const totalRemaining = computed(() =>
  ticketTypeList.value.reduce((sum, t) => sum + t.remainingQuantity, 0)
)
const totalSold = computed(() => totalCapacity.value - totalRemaining.value)

function soldPercent(tt: { totalQuantity: number; remainingQuantity: number }) {
  if (tt.totalQuantity === 0) return 0
  return Math.round(
    ((tt.totalQuantity - tt.remainingQuantity) / tt.totalQuantity) * 100
  )
}

function soldCount(tt: { totalQuantity: number; remainingQuantity: number }) {
  return tt.totalQuantity - tt.remainingQuantity
}

function soldBarColor(tt: {
  totalQuantity: number
  remainingQuantity: number
}) {
  const percentage = soldPercent(tt)
  if (percentage >= 90) return 'bg-error'
  if (percentage >= 60) return 'bg-warning'
  return 'bg-primary'
}

function openCreateModal() {
  editingTicketId.value = null
  formState.name = ''
  formState.price = 0
  formState.totalQuantity = 1
  formState.metadata = []
  isModalOpen.value = true
}

function openEditModal(ticketTypeId: Id<'ticketTypes'>) {
  const tt = ticketTypes.value?.find((t) => t._id === ticketTypeId)
  if (!tt) return

  editingTicketId.value = ticketTypeId
  formState.name = tt.name
  formState.price = tt.price
  formState.totalQuantity = tt.totalQuantity
  formState.metadata = tt.metadata ? [...tt.metadata] : []
  isModalOpen.value = true
}

function openDeleteModal(ticketTypeId: Id<'ticketTypes'>) {
  deletingTicketId.value = ticketTypeId
  isDeleteModalOpen.value = true
}

function addMetadata() {
  formState.metadata.push({ key: '', value: '' })
}

function removeMetadata(index: number) {
  formState.metadata.splice(index, 1)
}

function validate(st: typeof formState): FormError[] {
  const errors: FormError[] = []
  if (!st.name || st.name.trim().length === 0) {
    errors.push({ name: 'name', message: 'Ticket name is required' })
  }
  if (st.name && st.name.length > 50) {
    errors.push({
      name: 'name',
      message: 'Name must be at most 50 characters'
    })
  }
  if (st.price < 0) {
    errors.push({
      name: 'price',
      message: 'Price must be zero or greater'
    })
  }
  if (st.totalQuantity < 1) {
    errors.push({
      name: 'totalQuantity',
      message: 'Quantity must be at least 1'
    })
  }
  if (!Number.isInteger(st.totalQuantity)) {
    errors.push({
      name: 'totalQuantity',
      message: 'Quantity must be a whole number'
    })
  }
  return errors
}

async function onSubmit() {
  try {
    const cleanedMetadata = formState.metadata.filter(
      (m) => m.key.trim() && m.value.trim()
    )

    if (editingTicketId.value) {
      await updateTicketType({
        ticketTypeId: editingTicketId.value,
        name: formState.name,
        price: formState.price,
        totalQuantity: formState.totalQuantity,
        metadata: cleanedMetadata.length > 0 ? cleanedMetadata : undefined
      })
      toast.add({
        title: 'Ticket type updated',
        color: 'success',
        icon: 'i-lucide-check-circle'
      })
    } else {
      await createTicketType({
        eventId: eventId.value,
        name: formState.name,
        price: formState.price,
        totalQuantity: formState.totalQuantity,
        metadata: cleanedMetadata.length > 0 ? cleanedMetadata : undefined
      })
      toast.add({
        title: 'Ticket type created',
        color: 'success',
        icon: 'i-lucide-check-circle'
      })
    }
    isModalOpen.value = false
  } catch (error) {
    toast.add({
      title: editingTicketId.value
        ? 'Failed to update ticket type'
        : 'Failed to create ticket type',
      description:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  }
}

async function confirmDelete() {
  if (!deletingTicketId.value) return

  try {
    await deleteTicketType({ ticketTypeId: deletingTicketId.value })
    toast.add({
      title: 'Ticket type deleted',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
    isDeleteModalOpen.value = false
  } catch (error) {
    toast.add({
      title: 'Failed to delete ticket type',
      description:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  }
}
</script>

<template>
  <div>
    <UDashboardPanel>
      <template #header>
        <UDashboardNavbar>
          <template #left>
            <div class="flex items-center gap-2.5">
              <h1 class="text-base font-semibold text-default">Ticket Types</h1>
              <UBadge
                v-if="hasTicketTypes"
                color="neutral"
                variant="subtle"
                size="sm"
              >
                {{ ticketTypeList.length }}
              </UBadge>
            </div>
          </template>
          <template #right>
            <UButton
              v-if="isDraft"
              label="Add Ticket Type"
              icon="i-lucide-plus"
              size="xs"
              @click="openCreateModal"
            />
          </template>
        </UDashboardNavbar>
      </template>

      <template #body>
        <div class="w-full space-y-6">
          <!-- Draft restriction alert -->
          <UAlert
            v-if="!isDraft"
            icon="i-lucide-lock"
            color="warning"
            variant="subtle"
            title="Editing restricted"
            description="Ticket types can only be modified while the event is in draft status."
          />

          <!-- Summary Stats (only when tickets exist) -->
          <div v-if="hasTicketTypes" class="grid w-full gap-3 sm:grid-cols-3">
            <SummaryStatCard
              title="Total Capacity"
              :value="totalCapacity.toLocaleString()"
              icon="i-lucide-layers"
              icon-bg-class="bg-primary/10"
              icon-class="text-primary"
            />

            <SummaryStatCard
              title="Sold"
              :value="totalSold.toLocaleString()"
              icon="i-lucide-shopping-bag"
              icon-bg-class="bg-success/10"
              icon-class="text-success"
            />

            <SummaryStatCard
              title="Remaining"
              :value="totalRemaining.toLocaleString()"
              icon="i-lucide-package-open"
              icon-bg-class="bg-secondary/10"
              icon-class="text-secondary"
            />
          </div>

          <!-- Empty State -->
          <UEmpty
            v-if="hasLoadedTicketTypes && !hasTicketTypes"
            icon="i-lucide-ticket"
            title="No ticket types yet"
            description="Create your first ticket type to define pricing and capacity for your event."
            class="min-h-80 rounded-lg border border-dashed border-default/60"
          >
            <template #actions>
              <UButton
                v-if="isDraft"
                label="Create Ticket Type"
                icon="i-lucide-plus"
                size="sm"
                @click="openCreateModal"
              />
            </template>
          </UEmpty>

          <!-- Ticket Type Cards -->
          <div
            v-if="hasTicketTypes"
            class="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <div
              v-for="tt in ticketTypeList"
              :key="tt._id"
              class="group relative flex flex-col rounded-lg border border-default/70 bg-elevated/20 transition-colors hover:border-primary/30 hover:bg-elevated/30"
            >
              <!-- Card Header -->
              <div class="flex items-start justify-between gap-3 p-4 pb-3">
                <div class="min-w-0">
                  <h3 class="truncate text-sm font-semibold text-default">
                    {{ tt.name }}
                  </h3>
                  <p
                    class="mt-0.5 font-heading text-xl font-bold tracking-tight text-primary tabular-nums"
                  >
                    {{ formatPrice(tt.price) }}
                  </p>
                </div>
                <UDropdownMenu
                  v-if="isDraft"
                  :items="[
                    [
                      {
                        label: 'Edit',
                        icon: 'i-lucide-pencil',
                        onSelect: () => openEditModal(tt._id)
                      }
                    ],
                    [
                      {
                        label: 'Delete',
                        icon: 'i-lucide-trash-2',
                        color: 'error' as const,
                        onSelect: () => openDeleteModal(tt._id)
                      }
                    ]
                  ]"
                >
                  <UButton
                    icon="i-lucide-ellipsis-vertical"
                    variant="ghost"
                    color="neutral"
                    size="xs"
                    class="opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </UDropdownMenu>
              </div>

              <!-- Capacity Bar -->
              <div class="px-4 pb-4">
                <div class="mb-1.5 flex items-baseline justify-between">
                  <span class="text-xs font-medium text-muted">Capacity</span>
                  <span class="text-xs text-muted tabular-nums">
                    {{ soldCount(tt).toLocaleString() }}
                    /
                    {{ tt.totalQuantity.toLocaleString() }}
                    sold
                  </span>
                </div>
                <div
                  class="h-1.5 w-full overflow-hidden rounded-full bg-muted/30"
                >
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    :class="soldBarColor(tt)"
                    :style="{ width: `${soldPercent(tt)}%` }"
                  />
                </div>
              </div>

              <!-- Metadata Tags -->
              <div
                v-if="tt.metadata?.length"
                class="flex flex-wrap items-center gap-2 border-t border-default/40 px-4 py-3"
              >
                <p
                  class="w-full text-xs font-medium tracking-wide text-muted uppercase"
                >
                  Details
                </p>
                <UBadge
                  v-for="(m, i) in tt.metadata"
                  :key="i"
                  color="neutral"
                  variant="subtle"
                  size="sm"
                  class="max-w-full"
                >
                  <span class="text-muted">{{ m.key }}</span>
                  <span aria-hidden="true" class="text-muted">•</span>
                  <span class="font-medium text-default">{{ m.value }}</span>
                </UBadge>
              </div>
            </div>

            <!-- Add Card (draft only) -->
            <button
              v-if="isDraft"
              class="flex min-h-35 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-default/50 text-muted transition-colors hover:border-primary/40 hover:text-primary"
              @click="openCreateModal"
            >
              <UIcon name="i-lucide-plus" class="size-5" />
              <span class="text-xs font-medium">Add Ticket Type</span>
            </button>
          </div>
        </div>
      </template>
    </UDashboardPanel>

    <!-- Create/Edit Modal -->
    <UModal
      v-model:open="isModalOpen"
      :title="editingTicketId ? 'Edit Ticket Type' : 'New Ticket Type'"
      :description="
        editingTicketId
          ? 'Update ticket type details.'
          : 'Define a new ticket type for your event.'
      "
    >
      <template #body>
        <UForm
          :state="formState"
          :validate="validate"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField name="name" label="Ticket Name" required>
            <UInput
              v-model="formState.name"
              placeholder="e.g. Regular, VIP, Table"
              icon="i-lucide-tag"
              class="w-full"
            />
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField name="price" label="Price" required>
              <UInputNumber
                v-model="formState.price"
                :min="0"
                :step="100"
                class="w-full"
              />
            </UFormField>

            <UFormField name="totalQuantity" label="Quantity" required>
              <UInputNumber
                v-model="formState.totalQuantity"
                :min="1"
                :step="1"
                class="w-full"
              />
            </UFormField>
          </div>

          <!-- Metadata -->
          <div>
            <div class="mb-2 flex items-center justify-between">
              <p class="text-sm font-medium text-default">
                Metadata
                <span class="text-xs text-muted">(optional)</span>
              </p>
              <UButton
                label="Add Field"
                icon="i-lucide-plus"
                variant="ghost"
                size="xs"
                @click="addMetadata"
              />
            </div>

            <div
              v-if="formState.metadata.length === 0"
              class="rounded-md border border-dashed border-default/50 px-3 py-3 text-center text-xs text-muted"
            >
              No metadata fields. Add key-value pairs for extra info like seat
              numbers.
            </div>

            <div
              v-for="(m, index) in formState.metadata"
              :key="index"
              class="mb-2 flex items-center gap-2"
            >
              <UInput
                v-model="m.key"
                placeholder="Key (e.g. seat)"
                class="flex-1"
                size="sm"
              />
              <UInput
                v-model="m.value"
                placeholder="Value (e.g. A1)"
                class="flex-1"
                size="sm"
              />
              <UButton
                icon="i-lucide-x"
                variant="ghost"
                color="error"
                size="xs"
                @click="removeMetadata(index)"
              />
            </div>
          </div>

          <USeparator />

          <div class="flex justify-end gap-2">
            <UButton
              label="Cancel"
              color="neutral"
              variant="ghost"
              size="sm"
              @click="isModalOpen = false"
            />
            <UButton
              type="submit"
              :label="editingTicketId ? 'Save Changes' : 'Create'"
              size="sm"
              :loading="isCreating || isUpdating"
            />
          </div>
        </UForm>
      </template>
    </UModal>

    <!-- Delete Confirmation Modal -->
    <UModal
      v-model:open="isDeleteModalOpen"
      title="Delete Ticket Type"
      description="Are you sure you want to delete this ticket type? This action cannot be undone."
    >
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            label="Cancel"
            color="neutral"
            variant="ghost"
            size="sm"
            @click="isDeleteModalOpen = false"
          />
          <UButton
            label="Delete"
            color="error"
            icon="i-lucide-trash-2"
            size="sm"
            :loading="isDeleting"
            @click="confirmDelete"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
