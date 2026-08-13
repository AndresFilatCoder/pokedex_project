<script setup lang="ts">
defineProps<{
  total: number
  current: number
}>()
</script>

<template>
  <div class="flex items-center justify-center gap-2" role="presentation">
    <span
      v-for="step in total"
      :key="step"
      :class="[
        'h-2 rounded-full transition-all duration-300',
        step - 1 === current ? 'w-6 bg-pokedex-800' : 'w-2 bg-pokedex-100'
      ]"
    />
  </div>
</template>
