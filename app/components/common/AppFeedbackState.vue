<script setup lang="ts">
withDefaults(
  defineProps<{
    image: string
    title: string
    description?: string
    imageAlt?: string
    /** `h1` cuando el estado es el contenido principal de la página. */
    titleTag?: 'h1' | 'h2'
  }>(),
  {
    description: '',
    imageAlt: '',
    titleTag: 'h2'
  }
)
</script>

<template>
  <section
    class="flex min-h-[65vh] w-full flex-col items-center justify-center px-6 py-12 text-center"
  >
    <img :src="image" :alt="imageAlt" class="w-40 max-w-full md:w-48" />

    <component :is="titleTag" class="mt-6 max-w-md text-2xl font-bold text-ink md:text-3xl">
      {{ title }}
    </component>

    <p v-if="description" class="mt-3 max-w-md text-base text-zinc-500">
      {{ description }}
    </p>

    <div v-if="$slots.action" class="mt-8 w-full max-w-xs">
      <slot name="action" />
    </div>
  </section>
</template>
