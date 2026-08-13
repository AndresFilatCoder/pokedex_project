<script setup lang="ts">
import type { PokemonTypeName } from '~/types/pokemon'

const isOpen = defineModel<boolean>('open', { required: true })

const filters = useFiltersStore()
const { options, isLoading, error, loadTypes } = usePokemonTypes()

/** La selección solo llega al store al pulsar "Aplicar". */
const draft = ref<PokemonTypeName[]>([])
const isSectionOpen = ref(true)

const toggleType = (type: PokemonTypeName) => {
  draft.value = draft.value.includes(type)
    ? draft.value.filter(selected => selected !== type)
    : [...draft.value, type]
}

const apply = () => {
  filters.setSelectedTypes(draft.value)
  isOpen.value = false
}

watch(isOpen, async open => {
  if (!open) return

  draft.value = [...filters.selectedTypes]
  await loadTypes()
})
</script>

<template>
  <UModal v-model:open="isOpen" :close="false" :ui="{ content: 'max-w-md' }">
    <template #header>
      <div class="relative flex w-full items-center justify-center">
        <UButton
          icon="i-uil-times"
          color="neutral"
          variant="ghost"
          size="lg"
          aria-label="Cerrar filtros"
          class="absolute left-0"
          @click="isOpen = false"
        />
        <h2 class="text-lg font-bold text-ink">Filtra por tus preferencias</h2>
      </div>
    </template>

    <template #body>
      <button
        type="button"
        class="flex w-full items-center justify-between border-b border-zinc-200 pb-3 text-left"
        :aria-expanded="isSectionOpen"
        @click="isSectionOpen = !isSectionOpen"
      >
        <span class="text-lg font-bold text-ink">Tipo</span>
        <UIcon
          name="i-uil-angle-up"
          :class="[
            'size-5 text-zinc-500 transition-transform motion-reduce:transition-none',
            isSectionOpen ? '' : 'rotate-180'
          ]"
        />
      </button>

      <div v-show="isSectionOpen" class="max-h-[45vh] overflow-y-auto pt-2">
        <AppLoader v-if="isLoading" size="sm" />

        <p v-else-if="error" class="py-6 text-center text-zinc-500">
          No pudimos cargar los tipos de Pokémon.
        </p>

        <ul v-else>
          <li v-for="option in options" :key="option.name">
            <UCheckbox
              :model-value="draft.includes(option.name)"
              :label="option.label"
              size="lg"
              class="w-full flex-row-reverse justify-between py-3"
              @update:model-value="toggleType(option.name)"
            />
          </li>
        </ul>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full flex-col gap-3">
        <UButton block size="xl" class="justify-center rounded-full" @click="apply">
          Aplicar
        </UButton>

        <UButton
          block
          size="xl"
          color="neutral"
          variant="soft"
          class="justify-center rounded-full font-bold"
          @click="isOpen = false"
        >
          Cancelar
        </UButton>
      </div>
    </template>
  </UModal>
</template>
