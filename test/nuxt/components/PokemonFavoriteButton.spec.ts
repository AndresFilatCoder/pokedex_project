import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PokemonFavoriteButton from '~/components/pokemon/PokemonFavoriteButton.vue'
import { useFavoritesStore } from '~/stores/useFavoritesStore'
import type { PokemonSummary } from '~/types/pokemon'

const bulbasaur: PokemonSummary = {
  id: 1,
  name: 'bulbasaur',
  types: ['grass', 'poison'],
  sprite: 'https://sprites/1.png'
}

describe('PokemonFavoriteButton', () => {
  it('marca y desmarca el Pokémon al pulsarlo', async () => {
    const wrapper = await mountSuspended(PokemonFavoriteButton, {
      props: { pokemon: bulbasaur }
    })
    // El store se toma tras montar para usar la misma instancia que el componente.
    const store = useFavoritesStore()
    const button = wrapper.get('button')

    expect(store.isFavorite(bulbasaur.id)).toBe(false)
    expect(button.attributes('aria-pressed')).toBe('false')

    await button.trigger('click')

    expect(store.isFavorite(bulbasaur.id)).toBe(true)
    expect(button.attributes('aria-pressed')).toBe('true')

    await button.trigger('click')

    expect(store.isFavorite(bulbasaur.id)).toBe(false)
    expect(store.total).toBe(0)
  })
})
