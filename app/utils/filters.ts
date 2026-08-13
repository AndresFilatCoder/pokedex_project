import type { PokemonTypeName } from '~/types/pokemon'

/** Coincidencia parcial e insensible a mayúsculas y acentos, como un `ilike`. */
export const matchesPokemonSearch = (name: string, normalizedSearch: string): boolean =>
  !normalizedSearch || normalizeText(name).includes(normalizedSearch)

/** Basta con pertenecer a uno de los tipos marcados. */
export const matchesPokemonTypes = (
  types: PokemonTypeName[],
  selectedTypes: PokemonTypeName[]
): boolean => !selectedTypes.length || types.some(type => selectedTypes.includes(type))
