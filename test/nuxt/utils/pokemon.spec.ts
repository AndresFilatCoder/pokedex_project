import { describe, expect, it } from 'vitest'
import {
  formatCategory,
  formatHeight,
  formatPercentage,
  formatPokemonName,
  formatPokemonNumber,
  formatWeight,
  getIdFromResourceUrl,
  getPrimaryType,
  normalizeText,
  sanitizeFlavorText,
  toKilograms,
  toMeters,
  toPokemonSummary
} from '~/utils/pokemon'
import type { PokemonDetails } from '~/types/pokemon'

const bulbasaur = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  species: { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' },
  sprites: {
    front_default: 'https://sprites/1.png',
    other: {
      'official-artwork': { front_default: 'https://artwork/1.png' },
      home: { front_default: null }
    }
  },
  cries: { latest: 'https://cries/1.ogg', legacy: null },
  types: [
    { slot: 1, type: { name: 'grass', url: '' } },
    { slot: 2, type: { name: 'poison', url: '' } }
  ],
  abilities: []
} satisfies PokemonDetails

describe('identificadores', () => {
  it('extrae el id de la url de un recurso', () => {
    expect(getIdFromResourceUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25)
  })

  it('formatea el número como en el diseño', () => {
    expect(formatPokemonNumber(1)).toBe('Nº001')
    expect(formatPokemonNumber(150)).toBe('Nº150')
  })

  it('capitaliza el nombre que llega en minúscula', () => {
    expect(formatPokemonName('bulbasaur')).toBe('Bulbasaur')
  })
})

describe('unidades y formatos', () => {
  it('convierte hectogramos y decímetros', () => {
    expect(toKilograms(69)).toBe(6.9)
    expect(toMeters(7)).toBe(0.7)
  })

  it('formatea peso y altura con coma decimal', () => {
    expect(formatWeight(toKilograms(bulbasaur.weight))).toBe('6,9 kg')
    expect(formatHeight(toMeters(bulbasaur.height))).toBe('0,7 m')
  })

  it('formatea porcentajes sin decimales innecesarios', () => {
    expect(formatPercentage(87.5)).toBe('87,5%')
    expect(formatPercentage(100)).toBe('100%')
  })

  it('recorta el prefijo del género de la especie', () => {
    expect(formatCategory('Pokémon Semilla')).toBe('SEMILLA')
  })

  it('limpia los saltos de línea de las descripciones', () => {
    expect(sanitizeFlavorText('Una rara semilla\nle fue plantada\fen el lomo.')).toBe(
      'Una rara semilla le fue plantada en el lomo.'
    )
  })
})

describe('normalizeText', () => {
  it('ignora mayúsculas, acentos y espacios sobrantes', () => {
    expect(normalizeText('  PokÉmon ')).toBe('pokemon')
  })
})

describe('modelo de la interfaz', () => {
  it('el tipo principal es el primero de la lista', () => {
    expect(getPrimaryType(['grass', 'poison'])).toBe('grass')
  })

  it('convierte la respuesta de la API en el resumen de la card', () => {
    expect(toPokemonSummary(bulbasaur)).toEqual({
      id: 1,
      name: 'bulbasaur',
      types: ['grass', 'poison'],
      sprite: 'https://sprites/1.png'
    })
  })
})
