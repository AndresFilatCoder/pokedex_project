import type { LocalizedName } from '~/types/api'
import type { PokemonDetails, PokemonSummary, PokemonTypeName } from '~/types/pokemon'
import { API_LANGUAGE, DEFAULT_POKEMON_TYPE } from '~/constants/pokemon'

/** Extrae el id numérico de una url de recurso: `.../pokemon/25/` -> 25. */
export const getIdFromResourceUrl = (url: string): number => {
  const segments = url.split('/').filter(Boolean)
  return Number(segments.at(-1))
}

/** Formatea el identificador tal como aparece en el diseño: `Nº001`. */
export const formatPokemonNumber = (id: number): string => `Nº${String(id).padStart(3, '0')}`

/** Los nombres llegan en minúscula desde la API. */
export const formatPokemonName = (name: string): string =>
  name.charAt(0).toUpperCase() + name.slice(1)

/** Devuelve la traducción al español de la API o el valor de respaldo indicado. */
export const getLocalizedName = (names: LocalizedName[], fallback: string): string =>
  names.find(entry => entry.language.name === API_LANGUAGE)?.name ?? fallback

/** Normaliza texto para búsquedas insensibles a mayúsculas y acentos. */
export const normalizeText = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')

/** Tipo principal del Pokémon: define el color de su card. */
export const getPrimaryType = (types: PokemonTypeName[]): PokemonTypeName =>
  types[0] ?? DEFAULT_POKEMON_TYPE

/**
 * Sprite en pixel art, que es la estética de los diseños.
 * Se recurre al render oficial solo si la especie no tiene sprite clásico.
 */
export const getPokemonSprite = (sprites: PokemonDetails['sprites']): string | null =>
  sprites.front_default ?? sprites.other['official-artwork'].front_default

/** Convierte la respuesta de la API en el modelo que consume la interfaz. */
export const toPokemonSummary = (details: PokemonDetails): PokemonSummary => ({
  id: details.id,
  name: details.name,
  types: details.types.map(slot => slot.type.name as PokemonTypeName),
  sprite: getPokemonSprite(details.sprites)
})
