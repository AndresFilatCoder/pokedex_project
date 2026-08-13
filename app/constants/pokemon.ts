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

/**
 * Corazón del botón de favoritos, en la caja 24x24 de Iconify.
 *
 * Ambos trazados salen del icono `uil:heart`: el primero es el original, cuyo
 * contorno interior lo deja hueco, y el segundo conserva solo el contorno
 * exterior para pintarlo relleno. Unicons no incluye la variante sólida, y así
 * la silueta es idéntica en los dos estados.
 */
export const HEART_OUTLINE_PATH =
  'M20.16 5A6.29 6.29 0 0 0 12 4.36a6.27 6.27 0 0 0-8.16 9.48l6.21 6.22a2.78 2.78 0 0 0 3.9 0l6.21-6.22a6.27 6.27 0 0 0 0-8.84m-1.41 7.46l-6.21 6.21a.76.76 0 0 1-1.08 0l-6.21-6.24a4.29 4.29 0 0 1 0-6a4.27 4.27 0 0 1 6 0a1 1 0 0 0 1.42 0a4.27 4.27 0 0 1 6 0a4.29 4.29 0 0 1 .08 6Z'

export const HEART_SOLID_PATH =
  'M20.16 5A6.29 6.29 0 0 0 12 4.36a6.27 6.27 0 0 0-8.16 9.48l6.21 6.22a2.78 2.78 0 0 0 3.9 0l6.21-6.22a6.27 6.27 0 0 0 0-8.84Z'

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
