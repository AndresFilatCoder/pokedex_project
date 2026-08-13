<script setup lang="ts">
const props = defineProps<{ femaleRatio: number }>()

const maleRatio = computed(() => 100 - props.femaleRatio)
</script>

<template>
  <section>
    <h2 class="text-center text-xs font-medium uppercase tracking-wide text-zinc-500">Género</h2>

    <div class="mt-2 flex h-2 overflow-hidden rounded-full bg-zinc-200">
      <div class="bg-male" :style="{ width: `${maleRatio}%` }" />
      <div class="bg-female" :style="{ width: `${femaleRatio}%` }" />
    </div>

    <div class="mt-2 flex items-center justify-between text-sm text-zinc-700">
      <span class="flex items-center gap-1.5">
        <UIcon name="i-uil-mars" class="size-4 text-male" />
        {{ formatPercentage(maleRatio) }}
      </span>

      <span class="flex items-center gap-1.5">
        <UIcon name="i-uil-venus" class="size-4 text-female" />
        {{ formatPercentage(femaleRatio) }}
      </span>
    </div>
  </section>
</template>
