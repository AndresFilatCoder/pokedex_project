<script setup lang="ts">
import { POKEMON_TYPE_ICONS, POKEMON_TYPE_LABELS } from '~/constants/pokemon'
import type { PokemonTypeName } from '~/types/pokemon'

const props = defineProps<{ type: PokemonTypeName }>()

const label = computed(() => POKEMON_TYPE_LABELS[props.type])
const icon = computed(() => POKEMON_TYPE_ICONS[props.type])
</script>

<template>
  <!-- El atributo redefine `--type-base`: cada distintivo lleva el color de su propio tipo. -->
  <span
    :data-pokemon-type="type"
    class="inline-flex items-center gap-1.5 rounded-full bg-[var(--type-base)] py-1 pl-1 pr-3 text-sm font-medium text-white"
  >
    <span class="flex size-5 shrink-0 items-center justify-center rounded-full bg-white">
      <UIcon :name="icon" class="size-3.5 text-[var(--type-base)]" />
    </span>
    {{ label }}
  </span>
</template>
