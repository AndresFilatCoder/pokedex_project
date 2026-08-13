<script setup lang="ts">
import type { PokemonSummary } from '~/types/pokemon'

withDefaults(
  defineProps<{
    pokemons: PokemonSummary[]
    /** Cards de carga que se añaden al final mientras llega la siguiente tanda. */
    skeletons?: number
  }>(),
  { skeletons: 0 }
)
</script>

<template>
  <ul class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
    <li v-for="pokemon in pokemons" :key="pokemon.id">
      <PokemonCard :pokemon="pokemon" />
    </li>

    <li v-for="skeleton in skeletons" :key="`skeleton-${skeleton}`" aria-hidden="true">
      <PokemonCardSkeleton />
    </li>
  </ul>
</template>
