<script setup lang="ts">
import type { PokemonSummary } from '~/types/pokemon'

const props = defineProps<{ pokemon: PokemonSummary }>()

const favoritesStore = useFavoritesStore()

const isFavorite = computed(() => favoritesStore.isFavorite(props.pokemon.id))

const label = computed(() =>
  isFavorite.value
    ? `Quitar a ${formatPokemonName(props.pokemon.name)} de favoritos`
    : `Marcar a ${formatPokemonName(props.pokemon.name)} como favorito`
)
</script>

<template>
  <button
    type="button"
    :aria-label="label"
    :aria-pressed="isFavorite"
    class="flex size-11 items-center justify-center rounded-full bg-neutral-600/50 ring-2 ring-white/70 backdrop-blur-[2px] transition-transform hover:scale-110 active:scale-95 motion-reduce:transition-none"
    @click="favoritesStore.toggle(pokemon)"
  >
    <UIcon
      name="i-uil-heart"
      :class="['size-6 transition-colors', isFavorite ? 'text-heart' : 'text-white']"
    />
  </button>
</template>
