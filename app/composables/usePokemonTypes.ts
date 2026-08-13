import { POKEMON_TYPE_LABELS } from '~/constants/pokemon'
import type { PokemonTypeName, PokemonTypeOption } from '~/types/pokemon'

/**
 * Catálogo de tipos de la PokeAPI.
 *
 * El detalle de cada tipo trae a la vez su nombre en español y la lista de
 * Pokémon que lo tienen, así que una sola carga resuelve tanto las opciones
 * del modal como el filtrado por tipo.
 */
export const usePokemonTypes = () => {
  const { getTypes, getTypeDetails } = usePokemon()

  const options = useState<PokemonTypeOption[]>('pokemon-type-options', () => [])
  const members = useState<Map<string, string[]>>('pokemon-type-members', () => new Map())

  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  const loadTypes = async () => {
    if (options.value.length || isLoading.value) return

    isLoading.value = true
    error.value = null

    try {
      const catalog = await getTypes()
      const details = await Promise.all(catalog.results.map(type => getTypeDetails(type.name)))

      details.forEach(type => {
        members.value.set(
          type.name,
          type.pokemon.map(entry => entry.pokemon.name)
        )
      })

      options.value = details
        // Los tipos sin ningún Pokémon no aportan nada como opción de filtro.
        .filter(type => type.pokemon.length > 0)
        .map(type => ({
          name: type.name,
          label: getLocalizedName(type.names, POKEMON_TYPE_LABELS[type.name] ?? type.name)
        }))
        .sort((first, second) => first.label.localeCompare(second.label, 'es'))
    } catch (caught) {
      error.value =
        caught instanceof Error ? caught : new Error('No se pudo cargar el listado de tipos')
    } finally {
      isLoading.value = false
    }
  }

  /** Nombres de los Pokémon que pertenecen a alguno de los tipos indicados. */
  const getPokemonNamesByTypes = async (types: PokemonTypeName[]) => {
    if (!types.length) return null

    await loadTypes()

    return new Set(types.flatMap(type => members.value.get(type) ?? []))
  }

  return { options, isLoading, error, loadTypes, getPokemonNamesByTypes }
}
