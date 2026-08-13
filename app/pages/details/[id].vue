<script setup lang="ts">
import { ROUTES } from '~/constants/routes'

const route = useRoute()
const router = useRouter()

const { pokemon, isLoading, error, loadPokemon } = usePokemonDetail()

const pokemonId = computed(() => String(route.params.id))

useSeoMeta({
  title: () => (pokemon.value ? formatPokemonName(pokemon.value.name) : 'Detalle del Pokémon')
})

/** Vuelve al listado del que se llegó, o a la Pokédex si se entró por enlace directo. */
const goBack = () => {
  if (window.history.length > 1) return router.back()
  return navigateTo(ROUTES.pokedex)
}

onMounted(() => loadPokemon(pokemonId.value))
</script>

<template>
  <div>
    <AppLoader v-if="isLoading" size="lg" class="min-h-[70vh]" />

    <AppErrorState v-else-if="error || !pokemon" @retry="loadPokemon(pokemonId)" />

    <PokemonDetailCard v-else :pokemon="pokemon" @back="goBack" />
  </div>
</template>
