import { API_LANGUAGE, POKEMON_TYPE_LABELS } from '~/constants/pokemon'
import type {
  PokemonAbilitySlot,
  PokemonDetailView,
  PokemonSpecies,
  PokemonTypeName
} from '~/types/pokemon'

/** El diseño muestra una sola habilidad: la principal, no la oculta. */
const getMainAbility = (abilities: PokemonAbilitySlot[]) =>
  abilities.find(entry => !entry.is_hidden) ?? abilities[0]

/** Descripción en español; si la especie no la tiene, se usa la primera disponible. */
const getDescription = (species: PokemonSpecies) => {
  const entries = species.flavor_text_entries
  const entry = entries.find(item => item.language.name === API_LANGUAGE) ?? entries[0]

  return entry ? sanitizeFlavorText(entry.flavor_text) : ''
}

/** `gender_rate` son octavos de probabilidad de ser hembra; -1 significa sin género. */
const getFemaleRatio = (species: PokemonSpecies) =>
  species.gender_rate < 0 ? null : (species.gender_rate / 8) * 100

/**
 * Detalle completo de un Pokémon. Combina cuatro recursos de la PokeAPI: el
 * propio Pokémon, su especie (descripción, categoría y género), su habilidad
 * traducida y las relaciones de daño de sus tipos para calcular debilidades.
 */
export const usePokemonDetail = () => {
  const { getPokemonDetails, getPokemonSpecies, getAbility, getTypeDetails } = usePokemon()

  const pokemon = ref<PokemonDetailView | null>(null)
  const isLoading = ref(true)
  const error = ref<Error | null>(null)

  const loadPokemon = async (idOrName: string) => {
    isLoading.value = true
    error.value = null

    try {
      const details = await getPokemonDetails(idOrName)
      const mainAbility = getMainAbility(details.abilities)

      const [species, ability, typeDetails] = await Promise.all([
        getPokemonSpecies(getIdFromResourceUrl(details.species.url)),
        mainAbility ? getAbility(mainAbility.ability.name) : null,
        Promise.all(details.types.map(entry => getTypeDetails(entry.type.name)))
      ])

      pokemon.value = {
        ...toPokemonSummary(details),
        description: getDescription(species),
        weight: toKilograms(details.weight),
        height: toMeters(details.height),
        category: formatCategory(
          getLocalizedName(
            species.genera.map(genus => ({ name: genus.genus, language: genus.language })),
            ''
          )
        ),
        ability: ability
          ? getLocalizedName(ability.names, formatPokemonName(ability.name))
          : 'Desconocida',
        femaleRatio: getFemaleRatio(species),
        weaknesses: getPokemonWeaknesses(typeDetails).filter(
          (type): type is PokemonTypeName => type in POKEMON_TYPE_LABELS
        )
      }
    } catch (caught) {
      error.value =
        caught instanceof Error ? caught : new Error('No se pudo cargar el detalle del Pokémon')
    } finally {
      isLoading.value = false
    }
  }

  return { pokemon, isLoading, error, loadPokemon }
}
