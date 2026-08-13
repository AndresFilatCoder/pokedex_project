<script setup lang="ts">
import { ROUTES } from '~/constants/routes'

useSeoMeta({ title: 'Favoritos' })

const favoritesStore = useFavoritesStore()
const filters = useFiltersStore()

/** Los favoritos ya traen sus tipos, así que se filtran sin consultar la API. */
const filteredFavorites = computed(() =>
  favoritesStore.favorites.filter(
    pokemon =>
      matchesPokemonSearch(pokemon.name, filters.normalizedSearch) &&
      matchesPokemonTypes(pokemon.types, filters.selectedTypes)
  )
)
</script>

<template>
  <div class="flex flex-col gap-4">
    <AppPageHeader title="Favoritos" :to="ROUTES.pokedex" />

    <!-- Los favoritos se guardan en el navegador: no existen al renderizar en servidor. -->
    <ClientOnly>
      <template #fallback>
        <AppLoader size="lg" class="min-h-[50vh]" />
      </template>

      <AppFeedbackState
        v-if="!favoritesStore.total"
        image="/images/magikarp.png"
        image-alt="Magikarp desanimado"
        title="No has marcado ningún Pokémon como favorito"
        description="Haz clic en el ícono de corazón de tus Pokémon favoritos y aparecerán aquí."
      />

      <div v-else class="flex flex-col gap-4">
        <PokemonFilterBar :count="filteredFavorites.length" />

        <AppFeedbackState
          v-if="!filteredFavorites.length"
          image="/images/magikarp.png"
          image-alt="Magikarp desanimado"
          title="No encontramos ningún favorito"
          description="Prueba con otro nombre o cambia los tipos seleccionados."
        />

        <PokemonGrid v-else :pokemons="filteredFavorites" />
      </div>
    </ClientOnly>
  </div>
</template>
