import { describe, expect, it } from 'vitest'
import { matchesPokemonSearch, matchesPokemonTypes } from '~/utils/filters'
import { normalizeText } from '~/utils/pokemon'

// El segundo argumento llega ya normalizado desde el store, igual que en la aplicación.
const search = (name: string, term: string) => matchesPokemonSearch(name, normalizeText(term))

describe('matchesPokemonSearch', () => {
  it('encuentra coincidencias parciales en cualquier posición', () => {
    expect(search('snubbull', 'bul')).toBe(true)
    expect(search('bulbasaur', 'bul')).toBe(true)
  })

  it('ignora las mayúsculas, como un ilike', () => {
    expect(search('Bulbasaur', 'BUL')).toBe(true)
  })

  it('descarta lo que no contiene el texto', () => {
    expect(search('pikachu', 'bul')).toBe(false)
  })

  it('sin búsqueda no filtra nada', () => {
    expect(search('pikachu', '')).toBe(true)
  })
})

describe('matchesPokemonTypes', () => {
  it('basta con pertenecer a uno de los tipos marcados', () => {
    expect(matchesPokemonTypes(['grass', 'poison'], ['poison'])).toBe(true)
    expect(matchesPokemonTypes(['grass', 'poison'], ['fire', 'grass'])).toBe(true)
  })

  it('descarta al que no tiene ninguno de los tipos', () => {
    expect(matchesPokemonTypes(['water'], ['fire', 'grass'])).toBe(false)
  })

  it('sin tipos marcados no filtra nada', () => {
    expect(matchesPokemonTypes(['water'], [])).toBe(true)
  })
})

describe('combinación de filtros', () => {
  const pokemons = [
    { name: 'bulbasaur', types: ['grass', 'poison'] as const },
    { name: 'snubbull', types: ['fairy'] as const },
    { name: 'charmander', types: ['fire'] as const }
  ]

  it('aplica nombre y tipo a la vez', () => {
    const found = pokemons.filter(
      pokemon => search(pokemon.name, 'BUL') && matchesPokemonTypes([...pokemon.types], ['grass'])
    )

    expect(found.map(pokemon => pokemon.name)).toEqual(['bulbasaur'])
  })
})
