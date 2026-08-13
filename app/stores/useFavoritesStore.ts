import type { PokemonSummary } from '~/types/pokemon'

/**
 * Pokémon marcados como favoritos. Se guarda el resumen completo para
 * poder pintar la lista sin volver a consultar la API.
 */
export const useFavoritesStore = defineStore(
  'favorites',
  () => {
    const favorites = ref<PokemonSummary[]>([])

    const total = computed(() => favorites.value.length)

    const isFavorite = computed(() => (id: number) => favorites.value.some(item => item.id === id))

    const add = (pokemon: PokemonSummary) => {
      if (isFavorite.value(pokemon.id)) return
      favorites.value.push(pokemon)
    }

    const remove = (id: number) => {
      favorites.value = favorites.value.filter(item => item.id !== id)
    }

    const toggle = (pokemon: PokemonSummary) => {
      if (isFavorite.value(pokemon.id)) {
        remove(pokemon.id)
        return
      }
      add(pokemon)
    }

    return { favorites, total, isFavorite, add, remove, toggle }
  },
  { persist: true }
)
