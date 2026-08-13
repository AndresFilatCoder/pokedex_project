<script setup lang="ts">
import { ROUTES } from '~/constants/routes'
import type { PokemonSummary } from '~/types/pokemon'

const props = defineProps<{ pokemon: PokemonSummary }>()

const primaryType = computed(() => getPrimaryType(props.pokemon.types))
const displayName = computed(() => formatPokemonName(props.pokemon.name))
</script>

<template>
  <article
    :data-pokemon-type="primaryType"
    class="relative flex h-40 overflow-hidden rounded-2xl bg-[var(--type-soft)] transition-transform duration-200 hover:-translate-y-1 motion-reduce:transition-none"
  >
    <!--
      Enlace extendido: la card entera navega sin anidar el botón de favorito.
      El contorno de foco va hacia dentro porque la card recorta lo que sobresale.
    -->
    <NuxtLink
      :to="`${ROUTES.details}/${pokemon.id}`"
      class="absolute inset-0 z-10 rounded-2xl focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-pokedex-700"
    >
      <span class="sr-only">Ver detalles de {{ displayName }}</span>
    </NuxtLink>

    <div class="flex min-w-0 flex-1 flex-col justify-center gap-2 py-4 pl-4 pr-2">
      <span class="text-sm font-semibold text-zinc-600">
        {{ formatPokemonNumber(pokemon.id) }}
      </span>

      <h2 class="truncate text-2xl font-extrabold leading-tight text-ink">
        {{ displayName }}
      </h2>

      <ul class="flex flex-wrap items-center gap-1.5">
        <li v-for="type in pokemon.types" :key="type">
          <PokemonTypeBadge :type="type" />
        </li>
      </ul>
    </div>

    <div class="type-decoration relative w-[38%] shrink-0 rounded-2xl">
      <!-- TODO: Add image — silueta decorativa del tipo (hoja, llama, gota…). -->
      <img
        v-if="pokemon.sprite"
        :src="pokemon.sprite"
        :alt="displayName"
        loading="lazy"
        class="pixelated absolute inset-0 size-full object-contain p-3"
      />

      <PokemonFavoriteButton :pokemon="pokemon" class="absolute right-3 top-3 z-20" />
    </div>
  </article>
</template>
