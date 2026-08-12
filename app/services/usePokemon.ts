import useCustomFetch from '~/composables/common/fetching/useCustomFetch'
import { useCustomToast } from '~/composables/common/toast/useCustomToast'

export const usePokemon = () => {
  const $api = useCustomFetch()
  const toast = useCustomToast()

  const getPokemonDetails = async (name: string) => {
    const { data, error } = await $api.get<PokemonDetails>(`/pokemon/${name.toLowerCase()}`)

    if (error.value) throw error.value
    return data.value || null
  }

  const setPokemonResult = async (pokemon: Pokemon) => {
    let details: PokemonDetails | null = null

    try {
      details = await getPokemonDetails(pokemon.name)
    } catch {
      toast.add({
        title: 'Error',
        message: 'Failed to fetch Pokémon details'
      })
      return { ...pokemon, details: null }
    }

    return {
      ...pokemon,
      details
    }
  }

  const getPokemonList = async () => {
    const { data, error } = await $api.get<PokemonList>('pokemon')

    if (error.value) throw error.value
    if (!data.value) return null

    data.value.results = await Promise.all(
      data.value.results.map(async (pokemon: Pokemon) => await setPokemonResult(pokemon))
    )

    return data.value
  }

  const getType = async (name: string) => {
    const { data, error } = await $api.get<PokemonType>(`/type/${name}`)

    if (error.value) throw error.value
    return data.value || null
  }

  return { getPokemonList, getPokemonDetails, getType }
}
