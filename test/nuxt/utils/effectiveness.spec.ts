import { describe, expect, it } from 'vitest'
import { getPokemonWeaknesses } from '~/utils/effectiveness'
import type { NamedApiResource } from '~/types/api'
import type { PokemonTypeDetails, PokemonTypeName } from '~/types/pokemon'

const toResources = (names: string[]): NamedApiResource[] =>
  names.map(name => ({ name, url: `https://pokeapi.co/api/v2/type/${name}` }))

/** Solo se rellenan las relaciones defensivas, que son las que usa el cálculo. */
const buildType = (
  name: PokemonTypeName,
  relations: { double?: string[]; half?: string[]; none?: string[] }
): PokemonTypeDetails => ({
  id: 1,
  name,
  names: [],
  pokemon: [],
  damage_relations: {
    double_damage_from: toResources(relations.double ?? []),
    half_damage_from: toResources(relations.half ?? []),
    no_damage_from: toResources(relations.none ?? []),
    double_damage_to: [],
    half_damage_to: [],
    no_damage_to: []
  }
})

const grass = buildType('grass', {
  double: ['flying', 'poison', 'bug', 'fire', 'ice'],
  half: ['ground', 'water', 'grass', 'electric']
})

const poison = buildType('poison', {
  double: ['ground', 'psychic'],
  half: ['fighting', 'poison', 'bug', 'grass', 'fairy']
})

describe('getPokemonWeaknesses', () => {
  it('devuelve las debilidades de un Pokémon de un solo tipo', () => {
    expect(getPokemonWeaknesses([grass]).sort()).toEqual(
      ['bug', 'fire', 'flying', 'ice', 'poison'].sort()
    )
  })

  it('descarta lo que el segundo tipo resiste', () => {
    // Bulbasaur es de planta y veneno: el veneno anula las debilidades de la
    // planta a bicho, veneno y tierra.
    expect(getPokemonWeaknesses([grass, poison]).sort()).toEqual(
      ['fire', 'flying', 'ice', 'psychic'].sort()
    )
  })
})
