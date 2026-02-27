<script setup lang="ts">
import type { FormError } from '@nuxt/ui'
import { useSortable } from '@vueuse/integrations/useSortable'
import type { UseSortableOptions } from '@vueuse/integrations/useSortable'
import type { Doc, Id } from '~~/convex/_generated/dataModel'
import { api } from '~~/convex/_generated/api'

definePageMeta({
  layout: 'planner-event',
  requiredRole: 'planner'
})

const { event, eventId } = usePlannerEvent()
const toast = useToast()

useSeoMeta({
  title: computed(
    () => `Form Builder — ${event.value?.name || 'Event'} — Ticketly`
  )
})

const { data: formFields } = await useConvexQuery(
  api.formFields.listByEvent,
  computed(() => ({ eventId: eventId.value }))
)

const { mutate: createField, isPending: isCreating } = useConvexMutation(
  api.formFields.createFormField
)
const { mutate: updateField, isPending: isUpdating } = useConvexMutation(
  api.formFields.updateFormField
)
const { mutate: deleteField, isPending: isDeleting } = useConvexMutation(
  api.formFields.deleteFormField
)
const { mutate: reorderFields } = useConvexMutation(
  api.formFields.reorderFormFields
)

const sortableFields = ref<Array<Doc<'formFields'>>>([])
const sortableListEl = useTemplateRef<HTMLElement>('sortableListEl')
const isReordering = ref(false)

watch(
  formFields,
  (fields) => {
    sortableFields.value = fields ? [...fields] : []
  },
  { immediate: true }
)

// Slideover state
const isSlideoverOpen = ref(false)
const editingFieldId = ref<Id<'formFields'> | null>(null)
const isDeleteModalOpen = ref(false)
const deletingFieldId = ref<Id<'formFields'> | null>(null)

const fieldTypeOptions = [
  { label: 'Text', value: 'text' as const },
  { label: 'Email', value: 'email' as const },
  { label: 'Number', value: 'number' as const },
  { label: 'Dropdown', value: 'dropdown' as const }
]

const formState = reactive({
  fieldLabel: '',
  fieldType: 'text' as 'text' | 'email' | 'number' | 'dropdown',
  fieldOptions: [] as string[],
  isRequired: true
})

const newOptionInput = ref('')

function openCreateSlideover() {
  editingFieldId.value = null
  formState.fieldLabel = ''
  formState.fieldType = 'text'
  formState.fieldOptions = []
  formState.isRequired = true
  isSlideoverOpen.value = true
}

function openEditSlideover(fieldId: Id<'formFields'>) {
  const field = formFields.value?.find((f) => f._id === fieldId)
  if (!field) return

  editingFieldId.value = fieldId
  formState.fieldLabel = field.fieldLabel
  formState.fieldType = field.fieldType
  formState.fieldOptions = field.fieldOptions ? [...field.fieldOptions] : []
  formState.isRequired = field.isRequired
  isSlideoverOpen.value = true
}

function openDeleteModal(fieldId: Id<'formFields'>) {
  deletingFieldId.value = fieldId
  isDeleteModalOpen.value = true
}

function addOption() {
  const option = newOptionInput.value.trim()
  if (option && !formState.fieldOptions.includes(option)) {
    formState.fieldOptions.push(option)
    newOptionInput.value = ''
  }
}

function removeOption(index: number) {
  formState.fieldOptions.splice(index, 1)
}

function validate(st: typeof formState): FormError[] {
  const errors: FormError[] = []
  if (!st.fieldLabel || st.fieldLabel.trim().length === 0) {
    errors.push({
      name: 'fieldLabel',
      message: 'Field label is required'
    })
  }
  if (st.fieldType === 'dropdown' && st.fieldOptions.length === 0) {
    errors.push({
      name: 'fieldOptions',
      message: 'Dropdown fields require at least one option'
    })
  }
  return errors
}

async function onSubmit() {
  try {
    if (editingFieldId.value) {
      await updateField({
        formFieldId: editingFieldId.value,
        fieldLabel: formState.fieldLabel,
        fieldType: formState.fieldType,
        fieldOptions:
          formState.fieldType === 'dropdown'
            ? formState.fieldOptions
            : undefined,
        isRequired: formState.isRequired
      })
      toast.add({
        title: 'Field updated',
        color: 'success',
        icon: 'i-lucide-check-circle'
      })
    } else {
      await createField({
        eventId: eventId.value,
        fieldLabel: formState.fieldLabel,
        fieldType: formState.fieldType,
        fieldOptions:
          formState.fieldType === 'dropdown'
            ? formState.fieldOptions
            : undefined,
        isRequired: formState.isRequired
      })
      toast.add({
        title: 'Field created',
        color: 'success',
        icon: 'i-lucide-check-circle'
      })
    }
    isSlideoverOpen.value = false
  } catch (error) {
    toast.add({
      title: editingFieldId.value
        ? 'Failed to update field'
        : 'Failed to create field',
      description:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  }
}

async function confirmDelete() {
  if (!deletingFieldId.value) return

  try {
    await deleteField({ formFieldId: deletingFieldId.value })
    toast.add({
      title: 'Field deleted',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
    isDeleteModalOpen.value = false
  } catch (error) {
    toast.add({
      title: 'Failed to delete field',
      description:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  }
}

const fieldTypeIcon: Record<string, string> = {
  text: 'i-lucide-type',
  email: 'i-lucide-mail',
  number: 'i-lucide-hash',
  dropdown: 'i-lucide-chevron-down'
}

const showPreview = ref(true)

const sortableOptions = {
  onStart: () => {
    isReordering.value = true
  },
  onEnd: async () => {
    try {
      await nextTick()
      await reorderFields({
        eventId: eventId.value,
        orderedIds: sortableFields.value.map((field) => field._id)
      })
    } catch (error) {
      toast.add({
        title: 'Failed to reorder fields',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
        color: 'error',
        icon: 'i-lucide-alert-circle'
      })
    } finally {
      isReordering.value = false
    }
  }
} as UseSortableOptions

useSortable(sortableListEl, sortableFields, sortableOptions)
</script>

<template>
  <div class="flex min-h-0 min-w-0 flex-1 overflow-hidden">
    <UDashboardPanel
      :ui="{
        body: 'overflow-y-auto'
      }"
    >
      <template #header>
        <UDashboardNavbar>
          <template #left>
            <div class="flex items-center gap-2.5">
              <h1 class="text-base font-semibold text-default">Form Builder</h1>
              <UBadge v-if="sortableFields" color="neutral" variant="subtle">
                {{ sortableFields.length }}
                {{ sortableFields.length === 1 ? 'field' : 'fields' }}
              </UBadge>
            </div>
          </template>
          <template #right>
            <div class="flex items-center gap-1.5">
              <UButton
                :label="showPreview ? 'Hide Preview' : 'Preview'"
                :icon="showPreview ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                variant="ghost"
                color="neutral"
                size="xs"
                @click="showPreview = !showPreview"
              />
              <UButton
                label="Add Field"
                icon="i-lucide-plus"
                size="xs"
                @click="openCreateSlideover"
              />
            </div>
          </template>
        </UDashboardNavbar>
      </template>

      <template #body>
        <div class="p-4 sm:p-6">
          <div
            class="grid gap-6"
            :class="
              showPreview && sortableFields.length ? 'lg:grid-cols-2' : ''
            "
          >
            <!-- Field List -->
            <div class="space-y-2">
              <p class="mb-3 text-xs font-medium text-muted">
                Fields ({{ sortableFields.length }})
              </p>

              <UEmpty
                v-if="formFields && sortableFields.length === 0"
                icon="i-lucide-file-text"
                title="No form fields yet"
                description="Add fields that ticket buyers will fill out during checkout."
              >
                <template #actions>
                  <UButton
                    label="Add First Field"
                    icon="i-lucide-plus"
                    size="sm"
                    @click="openCreateSlideover"
                  />
                </template>
              </UEmpty>

              <div ref="sortableListEl" class="space-y-1.5">
                <div
                  v-for="field in sortableFields"
                  :key="field._id"
                  class="sortable-field-item group flex cursor-grab items-center gap-2.5 rounded-lg border border-default/50 px-3 py-2.5 transition-colors hover:border-default hover:bg-elevated/40 active:cursor-grabbing"
                >
                  <!-- Drag handle -->
                  <div
                    class="drag-handle flex cursor-grab items-center rounded p-1 text-muted transition-colors hover:text-default active:cursor-grabbing"
                    :class="{ 'pointer-events-none opacity-60': isReordering }"
                    title="Drag to reorder"
                  >
                    <UIcon name="i-lucide-grip-vertical" class="size-4" />
                  </div>

                  <!-- Field info -->
                  <div class="min-w-0 flex-1">
                    <div class="flex min-w-0 items-center gap-1.5">
                      <UIcon
                        :name="
                          fieldTypeIcon[field.fieldType] || 'i-lucide-type'
                        "
                        class="size-3.5 shrink-0 text-muted"
                      />
                      <span class="truncate text-sm font-medium text-default">
                        {{ field.fieldLabel }}
                      </span>
                      <div class="ml-auto flex shrink-0 items-center gap-1.5">
                        <UBadge
                          :label="field.fieldType"
                          color="neutral"
                          variant="subtle"
                          size="sm"
                        />
                        <UBadge
                          v-if="field.isRequired"
                          label="Required"
                          color="primary"
                          variant="subtle"
                          size="sm"
                        />
                        <UBadge
                          v-else
                          label="Optional"
                          color="neutral"
                          variant="outline"
                          size="sm"
                        />
                        <UBadge
                          v-if="
                            field.fieldType === 'dropdown' && field.fieldOptions
                          "
                          :label="`${field.fieldOptions.length} options`"
                          color="neutral"
                          variant="outline"
                          size="xs"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div
                    class="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <UButton
                      icon="i-lucide-pencil"
                      variant="ghost"
                      color="neutral"
                      size="xs"
                      @click="openEditSlideover(field._id)"
                    />
                    <UButton
                      icon="i-lucide-trash-2"
                      variant="ghost"
                      color="error"
                      size="xs"
                      @click="openDeleteModal(field._id)"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Preview Panel -->
            <div v-if="showPreview && sortableFields.length" class="space-y-2">
              <p class="mb-3 text-xs font-medium text-muted">
                Buyer Form Preview
              </p>

              <div
                class="rounded-lg border border-dashed border-default/60 p-4 sm:p-5"
              >
                <div class="space-y-4">
                  <div v-for="field in sortableFields" :key="field._id">
                    <UFormField
                      :label="field.fieldLabel"
                      :required="field.isRequired"
                    >
                      <UInput
                        v-if="field.fieldType === 'text'"
                        :placeholder="`Enter ${field.fieldLabel.toLowerCase()}`"
                        disabled
                        class="w-full"
                      />
                      <UInput
                        v-else-if="field.fieldType === 'email'"
                        type="email"
                        placeholder="email@example.com"
                        disabled
                        class="w-full"
                      />
                      <UInputNumber
                        v-else-if="field.fieldType === 'number'"
                        :placeholder="`Enter ${field.fieldLabel.toLowerCase()}`"
                        disabled
                        class="w-full"
                      />
                      <USelect
                        v-else-if="field.fieldType === 'dropdown'"
                        :items="field.fieldOptions || []"
                        :placeholder="`Select ${field.fieldLabel.toLowerCase()}`"
                        disabled
                        class="w-full"
                      />
                    </UFormField>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </UDashboardPanel>

    <!-- Create/Edit Slideover -->
    <USlideover
      v-model:open="isSlideoverOpen"
      :title="editingFieldId ? 'Edit Field' : 'Add Field'"
      side="right"
      :ui="{
        content: 'sm:max-w-md'
      }"
    >
      <template #body>
        <UForm
          :state="formState"
          :validate="validate"
          class="space-y-5"
          @submit="onSubmit"
        >
          <UFormField name="fieldLabel" label="Label" required>
            <UInput
              v-model="formState.fieldLabel"
              placeholder="e.g. Full Name"
              class="w-full"
            />
          </UFormField>

          <UFormField name="fieldType" label="Field Type" required>
            <USelect
              v-model="formState.fieldType"
              :items="fieldTypeOptions"
              value-key="value"
              class="w-full"
            />
          </UFormField>

          <!-- Dropdown Options -->
          <UFormField
            v-if="formState.fieldType === 'dropdown'"
            name="fieldOptions"
            label="Options"
            required
          >
            <div class="space-y-2">
              <div
                v-for="(option, index) in formState.fieldOptions"
                :key="index"
                class="flex items-center gap-2"
              >
                <UInput
                  :model-value="option"
                  class="flex-1"
                  size="sm"
                  disabled
                />
                <UButton
                  icon="i-lucide-x"
                  variant="ghost"
                  color="error"
                  size="xs"
                  @click="removeOption(index)"
                />
              </div>

              <div class="flex items-center gap-2">
                <UInput
                  v-model="newOptionInput"
                  placeholder="Type an option and press Add"
                  class="flex-1"
                  size="sm"
                  @keydown.enter.prevent="addOption"
                />
                <UButton
                  label="Add"
                  size="xs"
                  variant="outline"
                  @click="addOption"
                />
              </div>
            </div>
          </UFormField>

          <UFormField name="isRequired" label="Required">
            <USwitch
              v-model="formState.isRequired"
              label="This field is required"
            />
          </UFormField>

          <div class="flex justify-end gap-2 pt-4">
            <UButton
              label="Cancel"
              color="neutral"
              variant="ghost"
              size="sm"
              @click="isSlideoverOpen = false"
            />
            <UButton
              type="submit"
              :label="editingFieldId ? 'Save Changes' : 'Add Field'"
              size="sm"
              :loading="isCreating || isUpdating"
            />
          </div>
        </UForm>
      </template>
    </USlideover>

    <!-- Delete Confirmation -->
    <UModal
      v-model:open="isDeleteModalOpen"
      title="Delete Field"
      description="Are you sure you want to delete this form field? This action cannot be undone."
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
