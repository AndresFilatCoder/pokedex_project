import { POKEMON_PAGE_SIZE } from '~/constants/pokemon'
import type { Pokemon, PokemonSummary } from '~/types/pokemon'

/**
 * Listado general de Pokémon.
 *
 * El índice completo llega en una sola petición, pero solo trae nombre y url:
 * los detalles se piden por tandas conforme el usuario avanza y se guardan en
 * caché, de modo que volver atrás o repetir un tramo no vuelve a consultarlos.
 *
 * Los filtros se aplican sobre el índice completo, no sobre lo ya cargado, así
 * que buscan entre todos los Pokémon y no solo entre los visibles.
 *
 * El estado vive en `useState` para que navegar al detalle y regresar no
 * obligue a recargar todo el listado.
 */
export const usePokemonList = () => {
  const { getPokemonIndex, getPokemonDetails } = usePokemon()
  const { getPokemonNamesByTypes } = usePokemonTypes()
  const filters = useFiltersStore()

  const index = useState<Pokemon[]>('pokemon-index', () => [])
  const detailsCache = useState<Map<string, PokemonSummary>>(
    'pokemon-details-cache',
    () => new Map()
  )
  const visibleCount = useState('pokemon-visible-count', () => 0)
  /** Nombres admitidos por el filtro de tipos; `null` cuando no hay ninguno marcado. */
  const typeFilterNames = useState<Set<string> | null>('pokemon-type-filter', () => null)

  const isLoading = ref(false)
  const isLoadingMore = ref(false)
  const error = ref<Error | null>(null)

  const source = computed(() =>
    index.value.filter(pokemon => {
      if (!matchesPokemonSearch(pokemon.name, filters.normalizedSearch)) return false
      return !typeFilterNames.value || typeFilterNames.value.has(pokemon.name)
    })
  )

  const pokemons = computed(() =>
    source.value
      .slice(0, visibleCount.value)
      .map(item => detailsCache.value.get(item.name))
      .filter((pokemon): pokemon is PokemonSummary => Boolean(pokemon))
  )

  const total = computed(() => source.value.length)
  const hasMore = computed(() => visibleCount.value < total.value)

  const toError = (value: unknown) =>
    value instanceof Error ? value : new Error('Error inesperado al consultar la PokeAPI')

  const cacheDetails = async (items: Pokemon[]) => {
    const pending = items.filter(item => !detailsCache.value.has(item.name))
    const details = await Promise.all(pending.map(item => getPokemonDetails(item.name)))

    details.forEach(pokemon => detailsCache.value.set(pokemon.name, toPokemonSummary(pokemon)))
  }

  /** Carga la siguiente tanda de detalles y la hace visible. */
  const loadMore = async () => {
    if (isLoading.value || isLoadingMore.value || !hasMore.value) return

    isLoadingMore.value = true

    try {
      const nextBatch = source.value.slice(
        visibleCount.value,
        visibleCount.value + POKEMON_PAGE_SIZE
      )
      await cacheDetails(nextBatch)
      visibleCount.value += nextBatch.length
    } catch (caught) {
      error.value = toError(caught)
    } finally {
      isLoadingMore.value = false
    }
  }

  /**
   * Identifica cada carga. Como el filtro por nombre se aplica sin debounce,
   * cada pulsación lanza una carga nueva y solo la última puede escribir el
   * resultado: si no, una respuesta lenta dejaría el listado desincronizado
   * respecto al filtro que el usuario tiene escrito.
   */
  let currentRequest = 0

  const loadPokemons = async () => {
    const request = ++currentRequest

    isLoading.value = true
    error.value = null

    try {
      if (!index.value.length) {
        const response = await getPokemonIndex()
        index.value = response.results
      }

      const names = await getPokemonNamesByTypes(filters.selectedTypes)
      if (request !== currentRequest) return

      typeFilterNames.value = names

      const initialBatch = source.value.slice(0, Math.max(visibleCount.value, POKEMON_PAGE_SIZE))
      await cacheDetails(initialBatch)
      if (request !== currentRequest) return

      visibleCount.value = initialBatch.length
    } catch (caught) {
      if (request === currentRequest) error.value = toError(caught)
    } finally {
      if (request === currentRequest) isLoading.value = false
    }
  }

  /** Al cambiar un filtro el listado vuelve a empezar desde la primera tanda. */
  const applyFilters = async () => {
    visibleCount.value = 0
    await loadPokemons()
  }

  watch(() => filters.normalizedSearch, applyFilters)
  watch(() => filters.selectedTypes, applyFilters, { deep: true })

  return {
    pokemons,
    total,
    hasMore,
    isLoading,
    isLoadingMore,
    error,
    loadPokemons,
    loadMore
  }
}
