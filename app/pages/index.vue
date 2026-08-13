<script setup lang="ts">
import { POKEMON_PAGE_SIZE } from '~/constants/pokemon'

useSeoMeta({ title: 'Pokedex' })

const { pokemons, total, hasMore, isLoading, isLoadingMore, error, loadPokemons, loadMore } =
  usePokemonList()

const sentinel = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const pendingSkeletons = computed(() =>
  isLoadingMore.value ? Math.min(POKEMON_PAGE_SIZE, total.value - pokemons.value.length) : 0
)

/** Carga la siguiente tanda antes de que el usuario llegue al final del listado. */
const observeSentinel = (element: HTMLElement | null) => {
  observer?.disconnect()
  if (!element) return

  observer = new IntersectionObserver(
    entries => {
      if (entries.some(entry => entry.isIntersecting)) loadMore()
    },
    { rootMargin: '400px' }
  )

  observer.observe(element)
}

watch(sentinel, observeSentinel)

onMounted(loadPokemons)
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div class="flex flex-col gap-4">
    <h1 class="sr-only">Pokédex</h1>

    <PokemonFilterBar :count="total" />

    <AppLoader v-if="isLoading" size="lg" class="min-h-[50vh]" />

    <AppErrorState v-else-if="error && !pokemons.length" @retry="loadPokemons" />

    <AppFeedbackState
      v-else-if="!pokemons.length"
      image="/images/magikarp.png"
      image-alt="Magikarp desanimado"
      title="No encontramos ningún Pokémon"
      description="Prueba con otro nombre o cambia los tipos seleccionados."
    />

    <template v-else>
      <PokemonGrid :pokemons="pokemons" :skeletons="pendingSkeletons" />

      <!-- Si falla una tanda intermedia se conserva lo ya cargado. -->
      <AppErrorState v-if="error" @retry="loadMore" />

      <div v-else-if="hasMore" ref="sentinel" class="h-px" aria-hidden="true" />
    </template>
  </div>
</template>
