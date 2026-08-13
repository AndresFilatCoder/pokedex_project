<script setup lang="ts">
defineProps<{
  icon: string
  label: string
  value: string
}>()
</script>

<template>
  <div>
    <p class="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-zinc-500">
      <UIcon :name="icon" class="size-4" />
      {{ label }}
    </p>

    <p
      class="mt-2 rounded-xl border border-zinc-200 px-4 py-3 text-center text-lg font-medium text-ink"
    >
      {{ value }}
    </p>
  </div>
</template>
