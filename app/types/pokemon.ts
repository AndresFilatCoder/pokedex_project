import type { LocalizedName, NamedApiResource, PaginatedResponse } from './api'

export type PokemonTypeName =
  | 'normal'
  | 'fighting'
  | 'flying'
  | 'poison'
  | 'ground'
  | 'rock'
  | 'bug'
  | 'ghost'
  | 'steel'
  | 'fire'
  | 'water'
  | 'grass'
  | 'electric'
  | 'psychic'
  | 'ice'
  | 'dragon'
  | 'dark'
  | 'fairy'
  | 'stellar'
  | 'unknown'
  | 'shadow'

/** Entrada del índice general: la PokeAPI solo devuelve nombre y url. */
export type Pokemon = NamedApiResource

export type PokemonList = PaginatedResponse<Pokemon>

export interface PokemonSpriteSet {
  front_default: string | null
}

export interface PokemonSprites extends PokemonSpriteSet {
  other: {
    'official-artwork': PokemonSpriteSet
    home: PokemonSpriteSet
    showdown?: PokemonSpriteSet
  }
}

export interface PokemonTypeSlot {
  slot: number
  type: NamedApiResource
}

export interface PokemonAbilitySlot {
  slot: number
  is_hidden: boolean
  ability: NamedApiResource
}

/** Sonidos que emite el Pokémon. `legacy` falta en varias formas. */
export interface PokemonCries {
  latest: string | null
  legacy: string | null
}

export interface PokemonDetails {
  id: number
  name: string
  /** Decímetros. */
  height: number
  /** Hectogramos. */
  weight: number
  sprites: PokemonSprites
  cries: PokemonCries
  types: PokemonTypeSlot[]
  abilities: PokemonAbilitySlot[]
  species: NamedApiResource
}

export interface PokemonGenus {
  genus: string
  language: NamedApiResource
}

export interface PokemonFlavorText {
  flavor_text: string
  language: NamedApiResource
  version: NamedApiResource
}

export interface PokemonSpecies {
  id: number
  name: string
  /** -1 sin género; en otro caso, octavos de probabilidad de ser hembra. */
  gender_rate: number
  names: LocalizedName[]
  genera: PokemonGenus[]
  flavor_text_entries: PokemonFlavorText[]
}

export interface PokemonAbility {
  id: number
  name: string
  names: LocalizedName[]
}

export interface TypeDamageRelations {
  no_damage_from: NamedApiResource[]
  half_damage_from: NamedApiResource[]
  double_damage_from: NamedApiResource[]
  no_damage_to: NamedApiResource[]
  half_damage_to: NamedApiResource[]
  double_damage_to: NamedApiResource[]
}

export interface PokemonTypeDetails {
  id: number
  name: PokemonTypeName
  names: LocalizedName[]
  damage_relations: TypeDamageRelations
  pokemon: { slot: number; pokemon: NamedApiResource }[]
}

/** Modelo normalizado que consumen las cards y el store de favoritos. */
export interface PokemonSummary {
  id: number
  name: string
  types: PokemonTypeName[]
  sprite: string | null
}

/** Opción del filtro por tipo, con su nombre en español. */
export interface PokemonTypeOption {
  name: PokemonTypeName
  label: string
}

/** Modelo ya resuelto que consume la página de detalle. */
export interface PokemonDetailView extends PokemonSummary {
  description: string
  /** Kilogramos. */
  weight: number
  /** Metros. */
  height: number
  category: string
  ability: string
  /** Sonido del Pokémon; `null` si la API no lo tiene. */
  cry: string | null
  /** Porcentaje de hembras; `null` si la especie no tiene género. */
  femaleRatio: number | null
  weaknesses: PokemonTypeName[]
}
