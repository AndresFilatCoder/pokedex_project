import type { PokemonTypeName } from '~/types/pokemon'

/** Idioma en el que se piden los textos traducidos de la PokeAPI. */
export const API_LANGUAGE = 'es'

/** Tamaño de cada tanda de detalles que se cargan en el listado. */
export const POKEMON_PAGE_SIZE = 30

/** La PokeAPI no expone el total sin pedirlo; este límite trae el índice completo. */
export const POKEMON_INDEX_LIMIT = 100000

export const POKEMON_TYPES: PokemonTypeName[] = [
  'normal',
  'fighting',
  'flying',
  'poison',
  'ground',
  'rock',
  'bug',
  'ghost',
  'steel',
  'fire',
  'water',
  'grass',
  'electric',
  'psychic',
  'ice',
  'dragon',
  'dark',
  'fairy',
  'stellar',
  'unknown',
  'shadow'
]

export const DEFAULT_POKEMON_TYPE: PokemonTypeName = 'normal'

/**
 * Iconos de la única colección Iconify instalada (Unicons).
 * Planta y Dragón no tienen equivalente exacto; se usa el icono más cercano.
 */
export const POKEMON_TYPE_ICONS: Record<PokemonTypeName, string> = {
  normal: 'i-uil-circle',
  fighting: 'i-uil-dumbbell',
  flying: 'i-uil-wind',
  poison: 'i-uil-flask-potion',
  ground: 'i-uil-mountains',
  rock: 'i-uil-diamond',
  bug: 'i-uil-bug',
  ghost: 'i-uil-snapchat-ghost',
  steel: 'i-uil-cog',
  fire: 'i-uil-fire',
  water: 'i-uil-raindrops',
  grass: 'i-uil-flower',
  electric: 'i-uil-bolt',
  psychic: 'i-uil-brain',
  ice: 'i-uil-snowflake',
  dragon: 'i-uil-tornado',
  dark: 'i-uil-moon',
  fairy: 'i-uil-star',
  stellar: 'i-uil-star-half-alt',
  unknown: 'i-uil-question-circle',
  shadow: 'i-uil-ban'
}

/** Nombres en español de cada tipo, idénticos a los que devuelve la PokeAPI. */
export const POKEMON_TYPE_LABELS: Record<PokemonTypeName, string> = {
  normal: 'Normal',
  fighting: 'Lucha',
  flying: 'Volador',
  poison: 'Veneno',
  ground: 'Tierra',
  rock: 'Roca',
  bug: 'Bicho',
  ghost: 'Fantasma',
  steel: 'Acero',
  fire: 'Fuego',
  water: 'Agua',
  grass: 'Planta',
  electric: 'Eléctrico',
  psychic: 'Psíquico',
  ice: 'Hielo',
  dragon: 'Dragón',
  dark: 'Siniestro',
  fairy: 'Hada',
  stellar: 'Estelar',
  unknown: 'Desconocido',
  shadow: 'Sombra'
}
