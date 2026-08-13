<script setup lang="ts">
import type { PokemonDetailView } from '~/types/pokemon'

const props = defineProps<{ pokemon: PokemonDetailView }>()

defineEmits<{ back: [] }>()

const primaryType = computed(() => getPrimaryType(props.pokemon.types))
const displayName = computed(() => formatPokemonName(props.pokemon.name))
</script>

<template>
  <article class="mx-auto -mt-4 w-full max-w-2xl md:-mt-8">
    <!-- En móvil el panel llega a los bordes de la pantalla, como en el diseño. -->
    <header
      :data-pokemon-type="primaryType"
      class="type-decoration relative -mx-4 overflow-hidden rounded-b-[3rem] pb-4 sm:mx-0"
    >
      <!-- TODO: Add image — silueta decorativa del tipo (hoja, llama, gota…). -->
      <div class="flex items-start justify-between px-4 pt-4">
        <UButton
          icon="i-uil-angle-left"
          variant="ghost"
          size="xl"
          aria-label="Volver"
          class="rounded-full text-white hover:bg-white/20"
          @click="$emit('back')"
        />

        <PokemonFavoriteButton :pokemon="pokemon" plain />
      </div>

      <img
        v-if="pokemon.sprite"
        :src="pokemon.sprite"
        :alt="displayName"
        class="pixelated mx-auto h-44 w-auto object-contain md:h-56"
      />
    </header>

    <div class="flex flex-col gap-6 px-5 pt-6">
      <div>
        <h1 class="text-4xl font-extrabold leading-tight text-ink">{{ displayName }}</h1>
        <p class="mt-1 text-lg text-zinc-500">{{ formatPokemonNumber(pokemon.id) }}</p>
      </div>

      <ul class="flex flex-wrap items-center gap-2">
        <li v-for="type in pokemon.types" :key="type">
          <PokemonTypeBadge :type="type" />
        </li>
      </ul>

      <p v-if="pokemon.description" class="text-base leading-relaxed text-zinc-700">
        {{ pokemon.description }}
      </p>

      <hr class="border-zinc-200" />

      <div class="grid grid-cols-2 gap-4">
        <PokemonInfoBox icon="i-uil-weight" label="Peso" :value="formatWeight(pokemon.weight)" />
        <PokemonInfoBox
          icon="i-uil-arrows-v"
          label="Altura"
          :value="formatHeight(pokemon.height)"
        />
        <PokemonInfoBox
          v-if="pokemon.category"
          icon="i-uil-apps"
          label="Categoría"
          :value="pokemon.category"
        />
        <PokemonInfoBox icon="i-uil-process" label="Habilidad" :value="pokemon.ability" />
      </div>

      <PokemonGenderBar v-if="pokemon.femaleRatio !== null" :female-ratio="pokemon.femaleRatio" />

      <section v-if="pokemon.weaknesses.length">
        <h2 class="text-2xl font-bold text-ink">Debilidades</h2>

        <ul class="mt-3 flex flex-wrap items-center gap-2">
          <li v-for="weakness in pokemon.weaknesses" :key="weakness">
            <PokemonTypeBadge :type="weakness" />
          </li>
        </ul>
      </section>
    </div>
  </article>
</template>

<style scoped>
/* Reemplaza la silueta del diseño con un realce del color del tipo. */
.type-decoration {
  background: radial-gradient(
    circle at 50% 30%,
    color-mix(in srgb, white 34%, var(--type-base)) 0%,
    color-mix(in srgb, white 14%, var(--type-base)) 46%,
    var(--type-base) 78%
  );
}
</style>
