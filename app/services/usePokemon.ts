import type { UseFetchOptions } from 'nuxt/app'
import useCustomFetch from '~/composables/common/fetching/useCustomFetch'
import { POKEMON_INDEX_LIMIT } from '~/constants/pokemon'
import type {
  PokemonAbility,
  PokemonDetails,
  PokemonList,
  PokemonSpecies,
  PokemonTypeDetails,
  PokemonTypeName
} from '~/types/pokemon'
import type { NamedApiResource, PaginatedResponse } from '~/types/api'

/**
 * Capa de acceso a la PokeAPI. Solo resuelve peticiones: no transforma
 * ni guarda estado, de eso se encargan los composables y los stores.
 */
export const usePokemon = () => {
  const $api = useCustomFetch()
  // Se captura en el setup para que las peticiones encadenadas conserven el
  // contexto de Nuxt que necesita useFetch tras un await.
  const nuxtApp = useNuxtApp()

  const request = async <T>(url: string, options: UseFetchOptions<T> = {}): Promise<T> => {
    const { data, error } = await nuxtApp.runWithContext(() => $api.get<T>(url, options))

    if (error.value) throw error.value
    if (!data.value) throw new Error(`La PokeAPI no devolvió datos para "${url}"`)

    // useFetch tipa la respuesta como `PickFrom<T, KeysOf<T>>`, equivalente a
    // `T` pero que TypeScript no puede reconciliar con un genérico abierto.
    return data.value as T
  }

  /** Índice completo de Pokémon (solo nombre y url) en una sola petición. */
  const getPokemonIndex = () => request<PokemonList>(`/pokemon?limit=${POKEMON_INDEX_LIMIT}`)

  const getPokemonDetails = (idOrName: string | number) =>
    request<PokemonDetails>(`/pokemon/${String(idOrName).toLowerCase()}`)

  const getPokemonSpecies = (idOrName: string | number) =>
    request<PokemonSpecies>(`/pokemon-species/${String(idOrName).toLowerCase()}`)

  const getAbility = (name: string) => request<PokemonAbility>(`/ability/${name}`)

  /** Catálogo de tipos disponibles. */
  const getTypes = () => request<PaginatedResponse<NamedApiResource>>('/type')

  /** Detalle de un tipo: nombre traducido, relaciones de daño y sus Pokémon. */
  const getTypeDetails = (name: PokemonTypeName | string) =>
    request<PokemonTypeDetails>(`/type/${name}`)

  return {
    getPokemonIndex,
    getPokemonDetails,
    getPokemonSpecies,
    getAbility,
    getTypes,
    getTypeDetails
  }
}
