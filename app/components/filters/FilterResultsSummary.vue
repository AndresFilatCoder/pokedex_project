<script setup lang="ts">
defineProps<{ count: number }>()

const filters = useFiltersStore()
</script>

<template>
  <p v-if="filters.hasActiveFilters" class="flex flex-wrap items-center gap-x-2 text-zinc-500">
    <span>
      Se han encontrado
      <strong class="font-bold text-zinc-700">
        {{ count }} {{ count === 1 ? 'resultado' : 'resultados' }}
      </strong>
    </span>

    <button
      type="button"
      class="text-pokedex-500 underline underline-offset-2 transition-colors hover:text-pokedex-700"
      @click="filters.clearFilters()"
    >
      Borrar filtro
    </button>
  </p>
</template>
