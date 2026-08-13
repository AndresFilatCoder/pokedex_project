import { POKEMON_PAGE_SIZE } from '~/constants/pokemon'
import type { Pokemon, PokemonSummary } from '~/types/pokemon'

/**
 * Listado general de Pokémon.
 *
 * El índice completo llega en una sola petición, pero solo trae nombre y url:
 * los detalles se piden por tandas conforme el usuario avanza y se guardan en
 * caché, de modo que volver atrás o repetir un tramo no vuelve a consultarlos.
 *
 * El estado vive en `useState` para que navegar al detalle y regresar no
 * obligue a recargar todo el listado.
 */
export const usePokemonList = () => {
  const { getPokemonIndex, getPokemonDetails } = usePokemon()

  const index = useState<Pokemon[]>('pokemon-index', () => [])
  const detailsCache = useState<Map<string, PokemonSummary>>(
    'pokemon-details-cache',
    () => new Map()
  )
  const visibleCount = useState('pokemon-visible-count', () => 0)

  const isLoading = ref(false)
  const isLoadingMore = ref(false)
  const error = ref<Error | null>(null)

  /** Origen del listado. La Fase 4 aplicará aquí los filtros. */
  const source = computed(() => index.value)

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

  const loadPokemons = async () => {
    if (isLoading.value) return

    isLoading.value = true
    error.value = null

    try {
      if (!index.value.length) {
        const response = await getPokemonIndex()
        index.value = response.results
      }

      const initialBatch = source.value.slice(0, Math.max(visibleCount.value, POKEMON_PAGE_SIZE))
      await cacheDetails(initialBatch)
      visibleCount.value = initialBatch.length
    } catch (caught) {
      error.value = toError(caught)
    } finally {
      isLoading.value = false
    }
  }

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
