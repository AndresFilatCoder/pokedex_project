<script setup lang="ts">
defineProps<{
  title: string
  /** Destino de la flecha de retroceso. */
  to: string
}>()
</script>

<template>
  <header class="relative flex items-center justify-center py-1">
    <UButton
      :to="to"
      icon="i-uil-angle-left"
      color="neutral"
      variant="ghost"
      size="xl"
      aria-label="Volver"
      class="absolute left-0 rounded-full"
    />

    <h1 class="text-xl font-bold text-ink md:text-2xl">{{ title }}</h1>
  </header>
</template>
