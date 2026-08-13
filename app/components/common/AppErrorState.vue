<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    description?: string
  }>(),
  {
    title: 'Algo salió mal...',
    description:
      'No pudimos cargar la información en este momento. Verifica tu conexión o intenta nuevamente más tarde.'
  }
)

defineEmits<{ retry: [] }>()
</script>

<template>
  <AppFeedbackState
    image="/images/magikarp.png"
    image-alt="Magikarp desanimado"
    :title="title"
    :description="description"
  >
    <template #action>
      <UButton block size="xl" class="justify-center rounded-full" @click="$emit('retry')">
        Reintentar
      </UButton>
    </template>
  </AppFeedbackState>
</template>
