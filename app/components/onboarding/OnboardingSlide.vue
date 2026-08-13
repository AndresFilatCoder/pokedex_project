<script setup lang="ts">
import type { OnboardingStep } from '~/constants/onboarding'

defineProps<{ step: OnboardingStep }>()
</script>

<template>
  <div class="flex flex-col items-center text-center">
    <img
      :src="step.image"
      :alt="step.imageAlt"
      class="pixelated h-56 w-auto object-contain md:h-72"
    />

    <h1 class="mt-10 text-3xl font-bold leading-tight text-ink md:text-4xl">
      {{ step.title }}
    </h1>

    <p class="mt-4 text-base leading-relaxed text-zinc-500 md:text-lg">
      {{ step.description }}
    </p>
  </div>
</template>
