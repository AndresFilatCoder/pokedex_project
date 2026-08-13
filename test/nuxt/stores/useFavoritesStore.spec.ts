import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useFavoritesStore } from '~/stores/useFavoritesStore'
import type { PokemonSummary } from '~/types/pokemon'

const bulbasaur: PokemonSummary = {
  id: 1,
  name: 'bulbasaur',
  types: ['grass', 'poison'],
  sprite: 'https://sprites/1.png'
}

const charmander: PokemonSummary = {
  id: 4,
  name: 'charmander',
  types: ['fire'],
  sprite: 'https://sprites/4.png'
}

describe('useFavoritesStore', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('empieza vacío', () => {
    const store = useFavoritesStore()

    expect(store.total).toBe(0)
    expect(store.isFavorite(bulbasaur.id)).toBe(false)
  })

  it('añade un Pokémon a favoritos', () => {
    const store = useFavoritesStore()
    store.add(bulbasaur)

    expect(store.total).toBe(1)
    expect(store.isFavorite(bulbasaur.id)).toBe(true)
  })

  it('no duplica el mismo Pokémon', () => {
    const store = useFavoritesStore()
    store.add(bulbasaur)
    store.add(bulbasaur)

    expect(store.total).toBe(1)
  })

  it('elimina un Pokémon sin tocar los demás', () => {
    const store = useFavoritesStore()
    store.add(bulbasaur)
    store.add(charmander)
    store.remove(bulbasaur.id)

    expect(store.favorites.map(pokemon => pokemon.name)).toEqual(['charmander'])
  })

  it('toggle marca y desmarca', () => {
    const store = useFavoritesStore()

    store.toggle(bulbasaur)
    expect(store.isFavorite(bulbasaur.id)).toBe(true)

    store.toggle(bulbasaur)
    expect(store.isFavorite(bulbasaur.id)).toBe(false)
    expect(store.total).toBe(0)
  })
})
