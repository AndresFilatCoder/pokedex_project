<script setup lang="ts">
defineProps<{ count: number }>()

const filters = useFiltersStore()

const isTypeModalOpen = ref(false)

/** Sin debounce: el filtro se aplica con cada pulsación. */
const search = computed({
  get: () => filters.search,
  set: value => filters.setSearch(value)
})
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center gap-3">
      <UInput
        v-model="search"
        icon="i-uil-search"
        placeholder="Buscar Pokémon..."
        size="xl"
        class="min-w-0 flex-1"
        :ui="{ base: 'rounded-full ring-zinc-200 bg-white' }"
        aria-label="Buscar Pokémon por nombre"
      />

      <span
        aria-hidden="true"
        class="hidden size-12 shrink-0 items-center justify-center rounded-full ring-1 ring-zinc-200 sm:flex"
      >
        <UIcon name="i-uil-search" class="size-5 text-zinc-400" />
      </span>

      <UButton
        icon="i-uil-filter"
        color="neutral"
        variant="outline"
        size="xl"
        class="shrink-0 rounded-full"
        @click="isTypeModalOpen = true"
      >
        <span class="hidden sm:inline">Filtros</span>
        <span
          v-if="filters.selectedTypes.length"
          class="flex size-5 items-center justify-center rounded-full bg-pokedex-500 text-xs font-bold text-white"
        >
          {{ filters.selectedTypes.length }}
        </span>
      </UButton>
    </div>

    <FilterResultsSummary :count="count" />

    <PokemonTypeFilterModal v-model:open="isTypeModalOpen" />
  </div>
</template>
