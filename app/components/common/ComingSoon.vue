<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    description?: string
  }>(),
  {
    title: '¡Muy pronto disponible!',
    description:
      'Estamos trabajando para traerte esta sección. Vuelve más adelante para descubrir todas las novedades.'
  }
)
</script>

<template>
  <AppFeedbackState
    image="/images/jigglypuff.png"
    image-alt="Jigglypuff saludando"
    :title="title"
    :description="description"
    title-tag="h1"
  />
</template>
