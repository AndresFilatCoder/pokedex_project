import type { PokemonTypeName } from '~/types/pokemon'

/**
 * Filtros compartidos por el listado general y el de favoritos: se combinan
 * entre sí y se limpian juntos desde el botón "Borrar filtro".
 */
export const useFiltersStore = defineStore('filters', () => {
  const search = ref('')
  const selectedTypes = ref<PokemonTypeName[]>([])

  const normalizedSearch = computed(() => normalizeText(search.value))

  const hasActiveFilters = computed(
    () => normalizedSearch.value.length > 0 || selectedTypes.value.length > 0
  )

  const setSearch = (value: string) => {
    search.value = value
  }

  const setSelectedTypes = (types: PokemonTypeName[]) => {
    selectedTypes.value = [...types]
  }

  const clearFilters = () => {
    search.value = ''
    selectedTypes.value = []
  }

  return {
    search,
    selectedTypes,
    normalizedSearch,
    hasActiveFilters,
    setSearch,
    setSelectedTypes,
    clearFilters
  }
})
