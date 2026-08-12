import useCustomFetch from '~/composables/common/fetching/useCustomFetch'

export const usePokemon = () => {
  const $api = useCustomFetch()

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

  return { getPokemonList, getPokemonDetails }
}
